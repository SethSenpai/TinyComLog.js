TinyComLog.js
==========================

A tiny serial port logger for node.js and linux. The script
runs command line and requires the npm module
[serialport](https://www.npmjs.com/package/serialport).

##Commands:

`exit` closes the application

`list` lists the currently available ports on the system. This
function also gets called every time you start the program.

`start` opens a connection and starts reading the values
coming in. If the logging toggle is set it also starts
writing the data to the file specified.

`stop` stops the readout of data and the logging.

`setPort <value_here>` set the device that the program should
connect to. /dev/ is automatically appended and should be
omitted. Example: `setPort ttyAMC0`

`setRate <value_here>` sets the baudrate of the program.
Defaults to 9600. Example: `setRate 57600`

`setFile <value_here>` sets the filename of the log file.
Example: `setFile todaysLogs.txt` this will log your data to
data/todaysLogs.txt

`toggleLog` toggles whether or not the application will store
the read values.

`toggleTimestamp` toggles whether or not the application adds
a timestamp to each read and logged value. If set to true the
file will have its values separated by a comma. Example:
`2016:10:24:14:42:56,215`
