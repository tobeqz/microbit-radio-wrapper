radio.onReceivedNumber(num => {
    console.log(num)
})
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
    constructor(radioGroup: number) {
        radio.setGroup(radioGroup)
    }
    
    sendString(stringToSend: string) {
        const char_codes: number[] = [
            2 // 2 betekent Start of Text in ASCII
        ]

        for (const char of stringToSend) {
            char_codes.push(char.charCodeAt(0))
            console.log(char.charCodeAt(0))
        }        

        char_codes.push(3) // 3 betekent End of Text in ASCII

        let encoded_string = ""
        
        for (let i = 0; i < char_codes.length; i++) {
            const char_code = char_codes[i]
            encoded_string += char_code.toString(16) // 16, hexadecimaal
        }
        
        const string_parts = []
        // Verdeel de string in delen van 18 characters.
        // Ik kan er nu vanuit gaan dat alle characters hier ASCII zijn
        // Bij ASCII geldt: 1 char = 1 byte
        // En dus passen er altijd 18 characters in een packet
        
        for (let i = 0; i < encoded_string.length; i++) {
            if (i % 18 == 0) {
                string_parts.push("")
            }

            string_parts[string_parts.length-1] += encoded_string[i]
        }

        console.log(encoded_string)
        console.log(string_parts)
    }
    
    onReceive(callback: Function) {

    }
}

const rwrapper = new RadioWrapper(3)

rwrapper.sendString("tim's moeder is kaulo hoere bol en dik en vet asdl;fjasd;ljfasd;lfjasd;lkfjasd;lfjk")
