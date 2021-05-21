
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
        let all_bytes = []

        radio.onRecievedBuffer(buf => {
            const num_array = buf.toArray(NumberFormat.UInt8LE) 
            all_bytes = all_bytes.concat(num_array)

            if (num_array[num_array.length - 1] == 3) /* ASCII END TEXT */ {

            } 
        })

        // radio.onReceivedString(str => {
        //     full_string += str 

        //     // Kijk of dit end of message is
        //     if (str.substr(str.length-2) == "03") {
        //         let decoded_string = ""

        //         // Decode full string
        //         const encoded_message = full_string.substr(2, full_string.length-4)
        //         for (let i = 0; i < encoded_message.length; i+=2) {
        //             let encoded_byte = encoded_message.substr(i, 2)
        //             let byte_value = new Hexadecimal(encoded_byte).num
        //             let decoded_char = String.fromCharCode(byte_value)
        //             decoded_string += decoded_char
        //         }

        //         for (const callback of this.callbacks) {
        //             callback(decoded_string)
        //         }
        //     }
        // })

        

        full_string = ""
    }
    
    sendString(stringToSend: string) {
        const string_with_boundary = `\u{02}${stringToSend}\u{03}`
        // 02 en 03 staan in ASCII voor start en einde respectievelijk

        for (let i = 0; i < string_with_boundary.length; i += 18) {
            const slice = string_with_boundary.substr(i, 18)
            radio.send(slice)
        }
    }
    
    onReceive(callback: Function) {
        this.callbacks.push(callback)        
    }
}

const rwrapper = new RadioWrapper(3)

const start = control.millis()
rwrapper.onReceive((msg: string) => {
    console.log("Recieved at " + control.millis().toString() + " took: " + (control.millis() - start).toString())
})

rwrapper.sendString("tim's moeder is kaulo hoere bol en dik en vet asdl;fjasd;ljfasd;lfjasd;lkfjasd;lfjk")

