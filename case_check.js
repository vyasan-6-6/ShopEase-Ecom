const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const trackedFiles = execSync('git ls-files client/src').toString().split('\n').filter(Boolean);

const trackedFilesMap = new Map();
trackedFiles.forEach(f => {
    trackedFilesMap.set(f.toLowerCase(), f);
});

let errors = [];

function checkFile(file) {
    if(!file.endsWith('.js') && !file.endsWith('.jsx')) return;
    const content = fs.readFileSync(file, 'utf8');
    const requireRegex = /(?:require\(['"]([^'"]+)['"]\)|from ['"]([^'"]+)['"]|import ['"]([^'"]+)['"])/g;
    let match;
    while((match = requireRegex.exec(content)) !== null) {
        const reqPath = match[1] || match[2] || match[3];
        if(!reqPath.startsWith('.')) continue; // skip node_modules
        
        let resolvedPath = path.resolve(path.dirname(file), reqPath);
        let relPath = path.relative(process.cwd(), resolvedPath).replace(/\\/g, '/');
        
        // try adding .js, .jsx, index.js, index.jsx if missing
        let possiblePaths = [relPath, relPath + '.js', relPath + '.jsx', relPath + '/index.js', relPath + '/index.jsx'];
        let found = false;
        
        for(let p of possiblePaths) {
            if(trackedFilesMap.has(p.toLowerCase())) {
                found = true;
                const actualGitCase = trackedFilesMap.get(p.toLowerCase());
                if(actualGitCase !== p) {
                    errors.push(`Mismatch in ${file}: requires '${reqPath}' which resolves to ${p}, but git has ${actualGitCase}`);
                }
                break;
            }
        }
    }
}

trackedFiles.forEach(checkFile);
console.log(errors.length ? errors.join('\n') : 'All local requires match git case exactly!');
