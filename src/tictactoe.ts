import { WebhookClient } from 'discord.js'
import Board from './classes/Board'
import Player from './classes/Player'

export const button = async (interaction: any, client: any) => {

    if (!interaction.message.content?.includes(`<@${interaction.member.user.id}>`)) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { flags: 64, content: 'This board was created by another user!' } } })
    if (!(parseInt(interaction.data.custom_id) != null && parseInt(interaction.data.custom_id) <= 8 && interaction.data.custom_id >= 0)) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { flags: 64, content: 'don\'t change custom ids >:(' } } })
    
    let board = Board.boards.find(board => interaction.message.id === board.messageID) as Board

    if (!board) {

        const state: any[] = []

        interaction.message.components.forEach(component => component.components.forEach(button => state.push(button.label.trim())))

        board = new Board(interaction.message.id, state, new Player(-1))

        if (board.checkWinner()) {
            Board.boards.pop()
            return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { flags: 64, content: 'This game has already been completed!' } } })
        }

    }

    interaction.message.components.forEach((component, componentIndex) => {

        component.components.forEach((button, buttonIndex) => {

            if (button.custom_id === interaction.data.custom_id) {

                if (!board.insert('X', buttonIndex + 3 * componentIndex)) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { flags: 64, content: 'This position is already full!' } } })

                interaction.message.components[componentIndex].components[buttonIndex].style = 3
                interaction.message.components[componentIndex].components[buttonIndex].label = 'X'

                let checkWinner: any = board.checkWinner()

                if (!checkWinner) {

                    const bestMove = board.AIPlayer!.getBestMove(board, false)

                    interaction.message.components[Math.floor(bestMove / 3)].components[bestMove % 3].style = 4
                    interaction.message.components[Math.floor(bestMove / 3)].components[bestMove % 3].label = 'O'

                    board.insert('O', bestMove)

                    checkWinner = board.checkWinner()

                }

                let content
                if (checkWinner?.winner === 'X') {
                    content = `<@${interaction.member.user.id}> won!`
                    Board.boards.splice(Board.boards.indexOf(board))
                } else if (checkWinner?.winner === 'O') {
                    content = `<@${interaction.member.user.id}> lost.`
                    Board.boards.splice(Board.boards.indexOf(board))
                } else if (checkWinner?.winner === 'draw') {
                    content = `<@${interaction.member.user.id}> won by making it a draw!`
                    Board.boards.splice(Board.boards.indexOf(board))
                }

                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 7,
                        data: {
                            content,
                            allowed_mentions: { parse: [] },
                            components: interaction.message.components
                        }
                    }
                })

            }

        })

    })

}

export const command = async (interaction, client) => {

    let player

    if (interaction.data.options[0].options[0].options[0].value > 1) player = new Player(-1)
    else player = new Player(2)

    const board = new Board(undefined, ['', '', '', '', '', '', '', '', ''], player)

    const data = {
        type: 4,
        data: {
            content: `X: <@${interaction.member.user.id}> O: <@${client.user.id}>`,
            allowed_mentions: { parse: [] },
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            custom_id: '0',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '1',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '2',
                            label: ' '
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            custom_id: '3',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '4',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '5',
                            label: ' '
                        },
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            custom_id: '6',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '7',
                            label: ' '
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: '8',
                            label: ' '
                        },
                    ]
                }
            ]
        }
    }

    if (interaction.data.options[0].options[0].options[0].value === 3) {

        data.data.components[Math.floor(1)].components[1].style = 4
        data.data.components[Math.floor(1)].components[1].label = 'O'

        board.insert('O', 4)

    }

    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data
    })

    const message = await new WebhookClient(client.user.id, interaction.token).fetchMessage('@original')

    board.setMessageID(message.id)

}
