
/* 
 * Deze class is nodig omdat je maximaal 18 bytes
 * aan data kunt sturing via 1 sendString() call
 * dit staat HELEMAAL NERGENS in de documentatie
 * en ik kwam er na iets van 3 uur debuggen achter
 * dus bij deze, een radio wrapper die makecode eigenlijk
 * zelf moet supplyen als ze "beginnner friendly" willen
 * zijn. Het support alleen strings, omdat JSON.parse en
 * JSON.stringify te veel moeite waren voor microsoft
 * om te implementeren.
 */
class RadioWrapper {
    callbacks: Function[]
    
    constructor(radioGroup: number) {
        radio.setGroup(radioGroup)
        this.callbacks = []

        let full_string = ""

        radio.onReceivedString(str => {
            full_string += str 

            // Kijk of dit end of message is
            if (str.substr(str.length-2) == "03") {
                let decoded_string = ""
                console.log("End of message")

                // Decode full string
                const encoded_message = full_string.substr(2, full_string.length-4)
                for (let i = 0; i < encoded_message.length; i+=2) {
                    let encoded_byte = encoded_message.substr(i, 2)
                    let byte_value = new Hexadecimal(encoded_byte).num
                    let decoded_char = String.fromCharCode(byte_value)
                    decoded_string += decoded_char
                }

                for (const callback of this.callbacks) {
                    callback(decoded_string)
                }
            }
        })

        

        full_string = ""
    }
    
    sendString(stringToSend: string) {
        const char_codes: number[] = [
            2 // 2 betekent Start of Text in ASCII
        ]

        const message_buffer = Buffer.fromUTF8(stringToSend)
        const message_byte_array = message_buffer.toArray(NumberFormat.UInt8LE)

        // Dit is ASCII, waarin 2 het begin en 3 het einde betekent van de message
        const final_byte_array = [2].concat(message_byte_array).concat([3])

        
        for (let i = 0; i < final_byte_array.length; i += 18) {
            // Selecteer huidige slice
            const current_slice = final_byte_array.slice(i, i+18)
            const current_buf = Buffer.fromArray(current_slice)
            console.log("sending", current_slice)
            radio.sendBuffer(current_buf)
        }
    }
    
    onReceive(callback: Function) {
        this.callbacks.push(callback)        
    }
}

const rwrapper = new RadioWrapper(3)

rwrapper.onReceive((msg: string) => {
    console.log(msg)
})

rwrapper.sendString("tim's moeder is kaulo hoere bol en dik en vet asdl;fjasd;ljfasd;lfjasd;lkfjasd;lfjk")
