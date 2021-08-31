import Board from './Board'


class Player {

    nodesMap: Map<number, string | number>
    maxDepth: number

    constructor(maxDepth = -1) {
        this.maxDepth = maxDepth
        this.nodesMap = new Map()
    }

    getBestMove(board: Board, maximizing = true, callback: any = () => {}, depth = 0) {

        if (depth === 0) this.nodesMap.clear()

        const checkWinner: any = board.checkWinner()
        if (checkWinner || depth === this.maxDepth) {

            if (checkWinner?.winner === 'X') return 100 - depth
            else if (checkWinner?.winner === 'O') return (100 - depth) * -1

            return 0

        }


        if (maximizing) {

            let best = -100

            board.getAvailableMoves().forEach(index => {

                const child = new Board(undefined, board.state)
                Board.boards.pop()

                child.insert('X', index)

                const nodeValue = this.getBestMove(child, false, callback, depth + 1)

                board.remove(index)

                best = Math.max(best, nodeValue)


                if (depth === 0) {
                    const moves = this.nodesMap.has(nodeValue) ? `${this.nodesMap.get(nodeValue)},${index}` : index
                    this.nodesMap.set(nodeValue, moves)
                }

            })

            if (depth === 0) {

                let ret

                if (typeof this.nodesMap.get(best) === 'string') {
                    const arr = (this.nodesMap.get(best) as string).split(',')
                    const rand = Math.floor(Math.random() * arr.length)
                    ret = arr[rand]
                } else {
                    ret = this.nodesMap.get(best)
                }

                callback(ret)
                return ret

            }

            return best

        } else {

            let best = 100

            board.getAvailableMoves().forEach(index => {

                const child = new Board(undefined, board.state)
                Board.boards.pop()

                child.insert('O', index)

                let nodeValue = this.getBestMove(child, true, callback, depth + 1)

                board.remove(index)

                best = Math.min(best, nodeValue)

                
                if (depth === 0) {
                    const moves = this.nodesMap.has(nodeValue) ? `${this.nodesMap.get(nodeValue)},${index}` : index
                    this.nodesMap.set(nodeValue, moves)
                }

            })

            if (depth === 0) {

                let ret: any

                if (typeof this.nodesMap.get(best) === 'string') {
                    const arr = (this.nodesMap.get(best) as string).split(',')
                    const rand = Math.floor(Math.random() * arr.length)
                    ret = arr[rand]
                } else {
                    ret = this.nodesMap.get(best)
                }

                callback(ret)
                return ret

            }

            return best

        }

    }

}


export default Player