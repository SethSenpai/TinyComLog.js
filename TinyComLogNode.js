var SerialPort = require("serialport");
var readline = require("readline");
var fs = require('fs');

var deviceName = "";
var baudRate = 9600;
var madeFile = false;
var filePath = "data/log.txt"
var logData = false;
var timeStamp = true;

var port;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
  completer: tabComp
});

if (!fs.existsSync("data")){
    fs.mkdirSync("data");
}

listPorts();


  rl.on('line', function(line, lineCount, byteCount) {
    if(line == "exit"){
        console.log('Closing...');
        process.exit(0);
    }

    if(line.startsWith("setPort ")){
        console.log("Set port!");
        var command = line.split(" ");
        deviceName = "/dev/" + command[1];
    }

    if(line.startsWith("setRate ")){
        console.log("Set baudrate!");
        var command = line.split(" ");
        baudRate = parseInt(command[1]);
    }

    if(line.startsWith("setFile ")){
        console.log("Set filename!");
        var command = line.split(" ");
        filePath = "data/" + command[1];
    }    
    
    if (line == "toggleLog"){
        if(logData == false){
            logData = true;
            console.log("Now logging data to: " + filePath);
        }
        else
        {
            logData = false;
            console.log("Data logging is disabled");
        }
    }

    if (line == "toggleTimestamp"){
        if(timeStamp == false){
            timeStamp = true;
            console.log("Now adding a timestamp to every entry");
        }
        else
        {
            timeStamp = false;
            console.log("Entries will be logged without timestamp");
        }
    }

    if (line == "list"){
        listPorts();
    }

    if (line == "start"){
        port = new SerialPort(deviceName, {
        parser: SerialPort.parsers.readline('\n'),
        baudrate:baudRate
        });

        port.on('data', function (data) {
         console.log(': ' + data);
         logToFile(data);
        });
    }

    if (line == "stop"){
        port.close();
        console.log('stopping readout.');
    }


    rl.prompt();
  })
  .on('error', function(e) {
    // something went wrong 
  })
  .on('close', () => {
  console.log('Closing...');
  process.exit(0);
});

function logToFile(v){
    if(logData == true && timeStamp == false)
    {
        if(madeFile = false)
        {
            fs.writeFile(filePath, v , function (err) {
            if (err) return console.log(err);
                madeFile = true;
            });
        }
        else
        {
            fs.appendFile(filePath, v , function (err) {
            if (err) return console.log(err);
            });
        }
    }

    if(logData == true && timeStamp == true)
    {
        if(madeFile = false)
        {
            fs.writeFile(filePath, getDateTime() + "," + v , function (err) {
            if (err) return console.log(err);
                madeFile = true;
            });
        }
        else
        {
            fs.appendFile(filePath, getDateTime() + "," + v , function (err) {
            if (err) return console.log(err);
            });
        }
    }
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function listPorts() {
        SerialPort.list(function (err, ports) {
        console.log("current ports on system.");
        console.log("--------------------------");
    ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
        console.log("--------------------------");
    });
    rl.prompt();
    });
}

function tabComp(line) {
  var completions = 'start stop setFile setPort setRate toggleLog toggleTimestamp exit list'.split(' ');
  var hits = completions.filter((c) => { return c.indexOf(line) == 0 });
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}