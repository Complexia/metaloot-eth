import * as fcl from '@onflow/fcl'
import { useState } from 'react'
import elementStyles from '../styles/Elements.module.css'

// MetalootNFT
import GetViewNFT from '../cadence/scripts/NFT/GetViewNFT.cdc'
import SearchItemNFT from '../cadence/scripts/NFT/SearchItemNFT.cdc'

import SetUpAccount from '../cadence/transactions/NFT/SetUpAccount.cdc'
import MintNFT from '../cadence/transactions/NFT/MintNFT.cdc'
import TransferNFT from '../cadence/transactions/NFT/TransferNFT.cdc'
import SetUpRoyaltiesAccount from '../cadence/transactions/NFT/SetUpRoyaltiesAccount.cdc'

//GameSessisons
// import ReadActiveSession from '../cadence/scripts/ReadActiveSession.cdc'
// import ReadHistorySessions from '../cadence/scripts/ReadHistorySessions.cdc'
// import StartGame from '../cadence/transactions/StartGame.cdc'
// import EndGame from '../cadence/transactions/EndGame.cdc'
// import AddItemToSession from '../cadence/transactions/AddItemToSession.cdc'

//Marketplace
import ReadHelloWorld from '../cadence/scripts/ReadHelloWorld.cdc'
import UpdateHelloWorld from '../cadence/transactions/UpdateHelloWorld.cdc'

interface ContractAction {
    name: string;
    type: 'script' | 'transaction';
    code: string;
    requiresArgs?: boolean;
    argTypes?: string[]; // Changed to array of argument types
}

export default function ContractInterface() {
    const [selectedContract, setSelectedContract] = useState<string>('HelloWorld')
    const [selectedAction, setSelectedAction] = useState<ContractAction | null>(null)
    const [actionArgs, setActionArgs] = useState<string[]>([]) // Changed to array of strings
    const [result, setResult] = useState<any>(null)

    const contracts = {
        HelloWorld: {
            actions: [
                { name: 'Read Greeting', type: 'script', code: ReadHelloWorld },
                { name: 'Update Greeting', type: 'transaction', code: UpdateHelloWorld, requiresArgs: true, argTypes: ['String'] }
            ]
        },
        MetalootNFT: {
            actions: [
                // public view
                { name: 'Set Up Account', type: 'transaction', code: SetUpAccount },
                // public view
                { name: 'Read NFT', type: 'script', code: GetViewNFT, requiresArgs: true, argTypes: ['Address', 'UInt64'] },
                // public view
                { name: 'Search NFT', type: 'script', code: SearchItemNFT, requiresArgs: true, argTypes: ['Address', 'PublicPath'] },
                // public view
                { name: 'Transfer NFT', type: 'transaction', code: TransferNFT, requiresArgs: true, argTypes: ['Address', 'UInt64'] },
                { name: 'Mint NFT', type: 'transaction', code: MintNFT, requiresArgs: true, argTypes: ['Address', 'String', 'String', 'String', { 'String': 'String' }, ["UFix64"], ["String"], ["Address"]] },
                { name: 'SetUpRoyaltiesAccount', type: 'transaction', code: SetUpRoyaltiesAccount, requiresArgs: true, argTypes: ['StoragePath'] },
            ]
        }
        // GameSessions: {
        //     actions: [
        //         // public view
        //         { name: 'Read Active Session', type: 'script', code: ReadActiveSession, requiresArgs: true, argTypes: ['Address'] },
        //         // public view
        //         { name: 'Read History Sessions', type: 'script', code: ReadHistorySessions, requiresArgs: true, argTypes: ['Address'] },
        //         // private
        //         { name: 'StartGame', type: 'transaction', code: StartGame },
        //         // private
        //         { name: 'AddItemToSession', type: 'transaction', code: EndGame, requiresArgs: true, argTypes: ['String','{String,String}','{String,String}'] },
        //         // private
        //         { name: 'EndGame', type: 'transaction', code: EndGame }
        //     ]
        // }
    }

    const getArgValue = (value: string, type: string) => {
        switch (type) {
            case 'UInt64':
                return parseInt(value)
            case 'Address':
                return value // Flow addresses are strings
            case 'String':
            default:
                return value
        }
    }

    const executeAction = async () => {
        if (!selectedAction) return
        try {
            if (selectedAction.type === 'script') {
                console.log("debug 0");
                const response = await fcl.query({
                    cadence: selectedAction.code,
                    args: (arg, t) => selectedAction.requiresArgs ?
                        selectedAction.argTypes?.map((type, index) =>
                            arg(getArgValue(actionArgs[index], type), t[type])
                        ) || [] : []
                })
                console.log("debug 1", response);
                setResult(JSON.stringify(response, null, 2))
            } else {
                console.log("debug 0");
                const transactionId = await fcl.mutate({
                    cadence: selectedAction.code,
                    args: (arg, t) => selectedAction.requiresArgs ?
                        selectedAction.argTypes?.map((type, index) =>
                            arg(getArgValue(actionArgs[index], type), t[type])
                        ) || [] : []
                })
                console.log("debug 1");
                setResult(`Transaction ID: ${transactionId}`)
            }
        } catch (error) {
            setResult(`Error: ${error.message}`)
        }
    }

    async function test() {
        // Check if the user has the NFT receiver capability
        try {
            const result = await fcl.mutate({
                cadence: `
import HelloWorld from 0xceed54f46d4b1942

transaction() {

  prepare(acct: &Account) {
    log(acct.address)
  }

  execute {
    HelloWorld.changeGreeting(newGreeting: "con cac")
  }
}
            `,
            });
            console.log("this is result ", result);
        } catch (error) {
            console.error("Error setting up NFT storage:", error);
            // throw error;
        }
    };

    return (
        <div className={elementStyles.container}>
            <h2>Contract Interface</h2>

            <div>
                <h3>Select Contract</h3>
                <select
                    className={elementStyles.select}
                    value={selectedContract}
                    onChange={(e) => {
                        setSelectedContract(e.target.value)
                        setSelectedAction(null)
                        setResult(null)
                        setActionArgs([])
                    }}
                >
                    {Object.keys(contracts).map(contract => (
                        <option key={contract} value={contract}>{contract}</option>
                    ))}
                </select>
            </div>

            <div>
                <h3>Select Action</h3>
                <select
                    className={elementStyles.select}
                    value={selectedAction?.name || ''}
                    onChange={(e) => {
                        const action = contracts[selectedContract].actions.find(a => a.name === e.target.value)
                        setSelectedAction(action || null)
                        setResult(null)
                        setActionArgs([])
                    }}
                >
                    <option value="">Select an action...</option>
                    {contracts[selectedContract].actions.map(action => (
                        <option key={action.name} value={action.name}>{action.name}</option>
                    ))}
                </select>
            </div>

            {selectedAction?.requiresArgs && selectedAction.argTypes?.map((argType, index) => (
                <div key={index}>
                    <h3>Argument {index + 1} ({argType})</h3>
                    <input
                        type="text"
                        className={elementStyles.input}
                        value={actionArgs[index] || ''}
                        onChange={(e) => {
                            const newArgs = [...actionArgs]
                            newArgs[index] = e.target.value
                            setActionArgs(newArgs)
                        }}
                        placeholder={`Enter ${argType} argument...`}
                    />
                </div>
            ))}

            {selectedAction && (
                <button
                    className={elementStyles.button}
                    onClick={test}
                >
                    Execute {selectedAction.type === 'script' ? 'Script' : 'Transaction'}
                </button>
            )}

            {result && (
                <div>
                    <h3>Result</h3>
                    <pre className={elementStyles.pre}>
                        {result}
                    </pre>
                </div>
            )}
        </div>
    )
}
