class Node{
    constructor(char, freq){
        this.char=char;
        this.freq=freq;
        this.left=null;
        this.right=null;
    }
}
class MinHeap{
    constructor(){
        this.arr=[null];
    }
    size(){
        return this.arr.length-1;
    }
    push(node){
        this.arr.push(node);
        let index=this.size();
        while(index>1){
            let parent=Math.floor(index/2);
            if(this.arr[parent].freq>this.arr[index].freq){
                [this.arr[parent], this.arr[index]]=[this.arr[index], this.arr[parent]];
                index=parent;
            }
            else{
                return;
            }
        }
    }
    top(){
        return this.arr[1];
    }
    pop(){
        this.arr[1]=this.arr[this.size()];
        this.arr.pop();
        let index=1;
        while(index<this.size()){
            let left=2*index;
            let right=(2*index)+1;
            if(left<=this.size() && this.arr[index].freq>this.arr[left].freq){
                [this.arr[index], this.arr[left]]=[this.arr[left], this.arr[index]];
                index=left;
            }
            else if(right<=this.size() && this.arr[index].freq>this.arr[right].freq){
                [this.arr[index], this.arr[right]]=[this.arr[right], this.arr[index]];
                index=right;
            }
            else{
                return;
            }
        }
    }
}
function getFreqMap(text){
    let freqMap={};
    for(let ch of text){
        if(ch in freqMap){
            freqMap[ch]+=1;
        }
        else{
            freqMap[ch]=1;
        }
    }
    return freqMap;
}
function buildTree(freqMap){
    let pq=new MinHeap();
    for(let ch in freqMap){
        let temp=new Node(ch, freqMap[ch]);
        pq.push(temp);
    }
    while(pq.size()>1){
        let left=pq.top();
        pq.pop();
        let right=pq.top();
        pq.pop();
        let temp=new Node(null, left.freq+right.freq);
        temp.left=left;
        temp.right=right;
        pq.push(temp);
    }
    return pq.top();
}
function generateCode(node, path="", codeMap={}){
    if(!node){
        return;
    }
    if(node.char!=null){
        codeMap[node.char]=path;
    }
    generateCode(node.left, path+'0', codeMap);
    generateCode(node.right, path+'1', codeMap);
    return codeMap;
}
function serialiseTree(node){
    if(!node){
        return "";
    }
    if(node.char!=null){
        const charBinary=node.char.charCodeAt(0).toString(2).padStart(8, '0');
        return '1'+charBinary;
    }
    else{
        return '0'+serialiseTree(node.left)+serialiseTree(node.right);
    }
}
function deserialiseTree(queue){
    const bit =queue.shift();
    if(bit==='1'){
        const charBits=queue.splice(0, 8).join('');
        const charCode=parseInt(charBits, 2);
        const ch=String.fromCharCode(charCode);
        const temp=new Node(ch, 0);
        return temp;
    }
    const left=deserialiseTree(queue);
    const right=deserialiseTree(queue);
    const temp=new Node(null, 0);
    temp.left=left;
    temp.right=right;
    return temp;
}
function huffmanEncode(inputText){
    const freqMap=getFreqMap(inputText);
    const root=buildTree(freqMap);
    const codeMap=generateCode(root);
    let dataStr="";
    for(let ch of inputText){
        dataStr+=codeMap[ch];
    }
    const treeStr=serialiseTree(root);
    const treeLength=treeStr.length;
    const totalData=treeStr+dataStr;
    const byteArray=[];
    for(let i=0; i<totalData.length; i+=8){
        let byte=totalData.slice(i, i+8).padEnd(8, '0');
        byteArray.push(parseInt(byte, 2)&0xFF);
    }
    const encodedBytes=new Uint8Array(byteArray.length+2);
    encodedBytes[0]=(treeLength>>8)&0xFF;
    encodedBytes[1]=treeLength&0xFF;
    for(let i=0; i<byteArray.length; i++){
        encodedBytes[i+2]=byteArray[i];
    }
    return encodedBytes;
}
function huffmanDecode(encodedBytes){
    const treeLength=(encodedBytes[0]<<8)|encodedBytes[1];
    const bytes=[];
    for(let i=2; i<encodedBytes.length; i++){
        bytes.push(encodedBytes[i].toString(2).padStart(8, '0'));
    }
    const bitStr=bytes.join('');
    const treeBits=bitStr.slice(0, treeLength);
    const dataBits=bitStr.slice(treeLength);
    const root=deserialiseTree(treeBits.split(''));
    let decodedText="";
    let node=root;
    for(let bit of dataBits){
        if(bit==='0'){
            node=node.left;
        }
        else{
            node=node.right;
        }
        if(node.left==null && node.right==null){
            decodedText+=node.char;
            node=root;
        }
    }
    return decodedText;
}