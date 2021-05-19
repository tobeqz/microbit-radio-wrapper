radio.setGroup(1)

radio.sendString("123456789.123456789.123456789.123456789.123456789")
radio.onRecievedString(str => {
    console.log(str, str.length)
})
