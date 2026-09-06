const fs = require('fs');
const path = require('path');

function walk(dir){
  let res = [];
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if(stat.isDirectory()) res = res.concat(walk(p));
    else if(/\.jsx?$|\.tsx?$/.test(name)) res.push(p);
  }
  return res;
}

const files = walk(path.join(__dirname, '..', 'src'));
let hadError = false;
for(const f of files){
  try{
    const content = fs.readFileSync(f, 'utf8');
    // Try to parse by creating new Function
    new Function(content);
  }catch(e){
    hadError = true;
    console.log('ERROR in', f);
    console.log(e && e.message ? e.message : String(e));
    console.log('----');
  }
}
if(!hadError) console.log('All files parsed successfully.');
