radio.setGroup(1)

radio.sendString("123456789.123456789.123456789.123456789.123456789")
radio.onReceivedString(str => {
    console.log(str)
    console.log(str.length)
})