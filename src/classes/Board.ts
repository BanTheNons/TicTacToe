import Player from './Player'


class Board {

    static boards: Board[] = []

    messageID: string | undefined
    state: string[]
    AIPlayer: Player | undefined

    constructor(ID?: string, state?: string[], AIPlayer?: Player) {

        this.messageID = ID
        this.state = state || ['', '', '', '', '', '', '', '', '']
        this.AIPlayer = AIPlayer

        Board.boards.push(this)

    }

    setMessageID(ID: string): void {
        this.messageID = ID
    }

    printFormattedBoard(): void {

        let formattedString = ''

        this.state.forEach((cell, index) => {
            formattedString += cell ? ` ${cell} |` : '   |'
            if ((index + 1) % 3 === 0)  {
                formattedString = formattedString.slice(0,-1)
                if (index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n'
            }
        })
        console.log('%c' + formattedString, 'color: #c11dd4font-size:16px')

    }

    isEmpty() {
        return this.state.every(cell => !cell.trim());
    }

    isFull() {
        return this.state.every(cell => cell.trim())
    }

    checkWinner() {

        if (this.isEmpty()) return false

        if (this.state[0] === this.state[1] && this.state[0] === this.state[2] && this.state[0]) {
            return { winner: this.state[0], direction: 'H', row: 1 }
        }
        if (this.state[3] === this.state[4] && this.state[3] === this.state[5] && this.state[3]) {
            return { winner: this.state[3], direction: 'H', row: 2 }
        }
        if (this.state[6] === this.state[7] && this.state[6] === this.state[8] && this.state[6]) {
            return { winner: this.state[6], direction: 'H', row: 3 }
        }
    

        if (this.state[0] === this.state[3] && this.state[0] === this.state[6] && this.state[0]) {
            return { winner: this.state[0], direction: 'V', column: 1 }
        }
        if (this.state[1] === this.state[4] && this.state[1] === this.state[7] && this.state[1]) {
            return { winner: this.state[1], direction: 'V', column: 2 }
        }
        if (this.state[2] === this.state[5] && this.state[2] === this.state[8] && this.state[2]) {
            return { winner: this.state[2], direction: 'V', column: 3 }
        }
    

        if (this.state[0] === this.state[4] && this.state[0] === this.state[8] && this.state[0]) {
            return { winner: this.state[0], direction: 'D', diagonal: 'main' }
        }
        if (this.state[2] === this.state[4] && this.state[2] === this.state[6] && this.state[2]) {
            return { winner: this.state[2], direction: 'D', diagonal: 'counter' }
        }
    

        if (this.isFull()) {
            return { winner: 'draw' }
        }
    

        return false

    }

    insert (symbol: string, position: number): boolean {
        
        if (this.state[position]) {
            return false
        }

        this.state[position] = symbol
        return true

    }

    remove(position: number): boolean {

        if (!this.state[position]) {
            return false
        }

        this.state[position] = ''
        return true

    }

    getAvailableMoves(): number[] {

        const moves: number[] = []

        this.state.forEach((cell, index) => {
            if(!cell) moves.push(index)
        })

        return moves

    }

}

export default Board