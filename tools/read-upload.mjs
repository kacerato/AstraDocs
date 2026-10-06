// Reads only the explicit sanitized deployment manifest. Used by MCP uploads.
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('evidence/deploy-files.json','utf8'));
const index=Number(process.argv[2]);const offset=Number(process.argv[3]||0);
if(!Number.isInteger(index)||index<0||index>=manifest.length||!Number.isInteger(offset)||offset<0)throw Error('Invalid part');
const encoded=fs.readFileSync(manifest[index].local).toString('base64');
process.stdout.write(encoded.slice(offset,offset+16000));
