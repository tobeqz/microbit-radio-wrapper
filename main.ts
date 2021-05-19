radio.onReceivedNumber(num => {
    console.log(num)
})

const num_to_hex = "0123456789abcdef"

const hex_to_num {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "a": 10,
    "b": 11,
    "c": 12,
    "d": 13,
    "e": 14,
    "f": 15
}
/*
 * Makecode heeft natuurlijk geen .toString(16)
 * en ook geen parseInt(16)
 */
class Hexadecimal {
    string: string,
    num: number

    constructor(num: string | number) {
        if (typeof num == "string") {
            this.string = num
            let total = 0

            for (let i = num.length-1; i >= 0; i--) {
                total += hex_to_num[num[i]] * Math.pow(16, i)
            }

            self.num = total
        } else if (typeof num == "number") {
            this.num = num
            this.string = ""

            let rest = num

            const remainders: number[] = []

            while (rest > 0) {
                const remainder = rest % 16
                const rest = Math.floor(num / 16)
                remainders.push(remainder)
            }

            for (let i = remainders.length-1; i >= 0; i--) {
                this.string += num_to_hex[í]
            }
        }

    }
}
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
        }        

        char_codes.push(3) // 3 betekent End of Text in ASCII

        let encoded_string = ""
        
        for (let i = 0; i < char_codes.length; i++) {
            const char_code = char_codes[i]
            encoded_string += new Hexadecimal(char_code).string
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
