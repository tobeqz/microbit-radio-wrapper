radio.onReceivedNumber(num => {
    console.log(num)
})

radio.onReceivedString(str => {
    console.log(str)
})

const num_to_hex = "0123456789abcdef"

const hex_to_num: {
    [key: string]: number
} = {
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
    str: string
    num: number

    constructor(num: string | number) {
        if (typeof num == "string") {
            this.str = num
            let total = 0

            for (let i = num.length-1; i >= 0; i--) {
                total += hex_to_num[num[i]] * Math.pow(16, i)
            }

            this.num = total
        } else if (typeof num == "number") {
            this.num = num
            this.str = ""

            if (num < 16) {
                this.str = "0"
            }

            let rest = num

            const remainders: number[] = []

            while (rest > 0) {
                const remainder = rest % 16
                rest = Math.floor(rest / 16)
                remainders.push(remainder)
            }

            for (let i = remainders.length-1; i >= 0; i--) {
                this.str += num_to_hex[remainders[i]]
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
    callbacks: Function[]
    

    constructor(radioGroup: number) {
        radio.setGroup(radioGroup)
        this.callbacks = []

        let full_string = ""

        radio.onReceivedString(str => {
            full_string += str 

            // Check if this was end of message
            if (str.substr(full_string.length-2) == "03") {
                console.log("End of message")
                console.log(full_string)
                // Decode full string
            }
        })
    }
    
    sendString(stringToSend: string) {
        const char_codes: number[] = [
            2 // 2 betekent Start of Text in ASCII
        ]

        for (const char of stringToSend) {
            char_codes.push(char.charCodeAt(0))
        }        

        char_codes.push(3) // 3 betekent End of Text in ASCII
    
        // Kijk of er een charcode > 255 is, als die er is moet
        // er een sedatperator tussen de hexadecimale nummers komen
        // om de client te laten weten waar een nummer begin
        // en start. Als alle nummers kleiner of gelijk aan
        // 255 zijn, dan kan de client er vanuit gaan dat alle nummers
        // 2 characters lang zijn.
        
        let unicode_support = false

        for (const char_code of char_codes) {
            if (char_code > 255) {
                unicode_support = true 
            }
        }

        let encoded_string = ""
        
        for (let i = 0; i < char_codes.length; i++) {
            const char_code = char_codes[i]
            encoded_string += new Hexadecimal(char_code).str

            if (unicode_support && i != char_codes.length-1) {
                encoded_string += "." // Seperator
            }
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

        for (const part of string_parts) {
            radio.sendString(part)
        }
    }
    
    onReceive(callback: Function) {
        this.callbacks.push(callback)        
    }
}

const rwrapper = new RadioWrapper(3)

rwrapper.sendString("tim's moeder is kaulo hoere bol en dik en vet asdl;fjasd;ljfasd;lfjasd;lkfjasd;lfjk")
