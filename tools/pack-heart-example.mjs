import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
// Deterministic stored ZIP, bounded to the authored public tutorial files.
const files=['UI/hud.aeui','Images/heart-full.png','Images/heart-empty.png','README.txt','PlayerHealth.cs','HeartHud.cs','HeartDamageTrigger.cs'];
const root='dist/examples/heart-hud';
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc=buf=>{let n=0xffffffff;for(const b of buf)n=crcTable[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;};
const locals=[],centrals=[],manifest=[];let offset=0;
for(const filename of files){
  const file=path.join(root,filename),data=fs.readFileSync(file),name=Buffer.from(filename),sum=crc(data);
  if(data.length>1024*1024)throw Error('Example file unexpectedly large');
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(0x5d46,12);header.writeUInt32LE(sum,14);header.writeUInt32LE(data.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(name.length,26);
  const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(0x800,8);central.writeUInt16LE(0x5d46,14);central.writeUInt32LE(sum,16);central.writeUInt32LE(data.length,20);central.writeUInt32LE(data.length,24);central.writeUInt16LE(name.length,28);central.writeUInt32LE(offset,42);
  locals.push(header,name,data);centrals.push(central,name);offset+=header.length+name.length+data.length;
  manifest.push({file:filename,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
}
const central=Buffer.concat(centrals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);
fs.writeFileSync(path.join(root,'Astra-Heart-Hud.zip'),Buffer.concat([...locals,central,end]));
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({version:'snapshot-2026-10-06',kind:'authored-ui-and-scripts',uiSerialization:'native AEUI 5 serializer; readback verified',runtimeVerified:false,files:manifest},null,2)+'\n');
