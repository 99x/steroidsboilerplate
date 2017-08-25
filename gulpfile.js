var gulp  = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    through = require('through2'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    mergeJSON = require("merge-json");

gulp.task('deploy', function() {
    var tsProject = ts.createProject("tsconfig.json");
    
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});

gulp.task('compileTs', function() {

    var tsProject = ts.createProject("tsconfig.json");

    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.mapSources(function(sourcePath, file) {
            var splitData = sourcePath.split("/");
            var prefix = "";
            for (var i=0;i<splitData.length;i++)
                prefix += "../";
            return prefix + 'src/' + sourcePath;
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
});

gulp.task('compileSteroids', function() {
    var tsProject = ts.createProject("tsconfig.json");

    var tsResult = gulp.src('node_modules/steroidslibrary/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("node_modules/steroidslibrary"));
});


gulp.task('compileApp', function() {
    var tsProject = ts.createProject("tsconfig.json");
    var tsResult = gulp.src('*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./"));
});

gulp.task('compileServerless', function() {

    if (fs.existsSync("serverless.yml"))
        fs.unlinkSync("serverless.yml");
        
    fs.createReadStream('serverless.global.yml').pipe(fs.createWriteStream('serverless.yml'));

    return gulp.src('src/**/partial.yml')
    .pipe(through.obj(function (chunk, enc, cb) {
        function readFile(filename, cb){
            fs.readFile(filename, function (err,data) {
                if (err) cb(undefined);
                else cb (data.toString());
            });           
        }

        function cloneObject(obj){
            var outObj = {};

            for (var k in obj)
                outObj[k] = obj[k];

            return outObj;
        }

        function mergeFunctions(cDoc,fDoc){
            if (cDoc.functions && fDoc.functions){
                if (cDoc.functions["_"]){
                    var cObj = cDoc.functions["_"];

                    for (var fKey in fDoc.functions){
                        if (cDoc.functions[fKey] === undefined){
                            var cObj_clone = cloneObject(cObj);
                            var cObjHttp=cObj.events[0];
                            var fObjHttp=fDoc.functions[fKey].events[0];

                            delete cObj_clone.events;

                            fDoc.functions[fKey].events[0] = mergeJSON.merge(fObjHttp, cObjHttp);
                            fDoc.functions[fKey] = mergeJSON.merge(fDoc.functions[fKey], cObj_clone);
                        }
                    }
                }
            }
        }

        function mergeDocuments(gDoc, cDoc, fDoc){
            if (cDoc)
                mergeFunctions(cDoc,fDoc);
            var result = mergeJSON.merge(gDoc, fDoc);
            var yamlData = yaml.safeDump(result);
            fs.writeFileSync("serverless.yml",yamlData);
        }

        readFile("serverless.yml",function(gData){
            readFile("serverless.common.yml",function(cData){
                readFile(chunk.path,function(fData){
                    var gDoc = yaml.safeLoad(gData);
                    var cDoc = undefined;
                    if (cData)
                     cDoc = yaml.safeLoad(cData);
                    var fDoc = yaml.safeLoad(fData);
                    mergeDocuments(gDoc,cDoc,fDoc);
                    cb(null, JSON.stringify(fDoc));
                });
            });
        });


    }))
});


gulp.task("compileAll",["compileTs","compileSteroids", "compileApp","compileServerless"]);