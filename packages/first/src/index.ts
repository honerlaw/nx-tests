import { second } from "second"

export function first() {
    return {
        first: {
            second: second()
        }
    }
}

console.log(first())
