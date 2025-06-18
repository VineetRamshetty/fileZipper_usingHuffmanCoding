let inputText="";
let encodedBytes=null;
let decodedText="";
let inputFileName="";
let outputFileName="";
let inputFileSize=0;

const inputFile=document.querySelector("#inputFile");
const message=document.querySelector(".messageBlock");
const encodeButton=document.querySelector("#encodeButton");
const decodeButton=document.querySelector("#decodeButton");
const downloadBtn=document.querySelector("#downloadBtn");
const inputFileNameDisplay = document.querySelector("#inputFileNameDisplay");
const outputFileNameDisplay = document.querySelector("#outputFileNameDisplay");
const beforeSize = document.querySelector("#beforeSize");
const afterSize = document.querySelector("#afterSize");


function updateMessage(msg, color="black"){
    message.innerText=msg;
    message.style.color=color;
}
inputFile.addEventListener("change", (event)=>{
    inputText="";
    encodedBytes=null;
    decodedText="";
    inputFileName="";
    outputFileName="";
    inputFileSize=0;
    const file=event.target.files[0];
    if(!file){
        return;
    }
    inputFileName=file.name;
    inputFileSize=(file.size / 1024).toFixed(2);
    inputFileNameDisplay.innerText=`File: ${inputFileName}`;
    outputFileNameDisplay.innerText="";
    afterSize.innerText= "";
    const reader=new FileReader();
    if(file.name.endsWith(".txt")){
        reader.onload=(evt)=>{
            inputText=evt.target.result;
            if(inputText.length===0){
                alert("Invalid .txt File");
                let msg="Uploaded File is Empty. Please enter a valid .txt file";
                updateMessage(msg, "orange");
                inputFileNameDisplay.innerText="";
                beforeSize.innerText="";
                return;
            }
            let msg="Text file is uploaded, Click on Encode Button";
            updateMessage(msg, "black");
            beforeSize.innerText=`Original Size: ${inputFileSize} KB`;
        }
        reader.readAsText(file);
    }
    else if(file.name.endsWith(".huff")){
        reader.onload=(evt)=>{
            encodedBytes=new Uint8Array(evt.target.result);
            if(encodedBytes.length===0){
                alert("Invalid .huff File");
                let msg="Uploaded File is Empty. Please enter a valid .huff file";
                updateMessage(msg, "orange");
                inputFileNameDisplay.innerText="";
                beforeSize.innerText="";
                return;
            }
            let msg="Encoded file is uploaded, Click on Decode Button";
            updateMessage(msg, "black");
            beforeSize.innerText=`Original Size: ${inputFileSize} KB`;
        }
        reader.readAsArrayBuffer(file);
    }
    else{
        alert("Invalid file type");
        let msg="Please upload a valid .txt/.huff file";
        updateMessage(msg, "red");
    }
});
encodeButton.addEventListener("click", ()=>{
    if(!inputText){
        alert("Text file is not uploaded");
        let msg="Please enter a valid .txt file to encode";
        updateMessage(msg, "orange");
        return;
    }
    encodedBytes=huffmanEncode(inputText);
    let compressedSize=(encodedBytes.length/1024).toFixed(2);
    let compressionRatio=((compressedSize/inputFileSize)*100).toFixed(2);
    let msg=`Encoding Completed! Click DOWNLOAD to download the encoded file ( Compression Ratio: ${compressionRatio}% )`;
    updateMessage(msg, "green");
    outputFileName=`${inputFileName.split('.')[0]}_encoded.huff`;
    outputFileNameDisplay.innerText=`File: ${outputFileName}`;
    afterSize.innerText=`Compressed Size: ${compressedSize} KB`;
});
decodeButton.addEventListener("click", ()=>{
    if(!encodedBytes){
        alert("Encoded file is not uploaded");
        let msg="Please enter a valid .huff file to decode";
        updateMessage(msg, "orange");
        return;
    }
    decodedText=huffmanDecode(encodedBytes);
    let decompressedSize=(decodedText.length/1024).toFixed(2);
    let decompressionRatio=((decompressedSize/inputFileSize)*100).toFixed(2);
    let msg=`Decoding Completed! Click DOWNLOAD to download the decoded file ( Decompression Ratio: ${decompressionRatio}% )`;
    updateMessage(msg, "green");
    outputFileName=`${inputFileName.split('.')[0]}_decoded.txt`;
    outputFileNameDisplay.innerText=`File: ${outputFileName}`;
    afterSize.innerText=`Decompressed Size: ${decompressedSize} KB`;
});
downloadBtn.addEventListener("click", ()=>{
    if(inputText && encodedBytes){
        downloadFile(encodedBytes, outputFileName);
    }
    else if(encodedBytes && decodedText){
        downloadFile(decodedText, outputFileName);
    }
    else{
        alert("Nothing to download");
        let msg="Please upload a valid .txt/.huff file and click on Encode/Decode";
        updateMessage(msg, "red");
    }
});
function downloadFile(data, fileName){
    let blob;
    if(typeof data==="string"){
        blob=new Blob([data], {type: "text/plain"});
    }
    else{
        blob=new Blob([data], {type: "application/octet-stream"});
    }
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}