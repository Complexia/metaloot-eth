import { invoke } from '@tauri-apps/api/core';
import React, { useEffect, useState } from 'react';

interface Transaction {
    hash: string;
    url: string;
    status: 'success' | 'fail';
}

const dummyTransactions: Transaction[] = [
    {
        hash: '0x1234...abcd',
        url: 'https://etherscan.io/tx/0x1234',
        status: 'success',
    },
    {
        hash: '0x5678...efgh',
        url: 'https://etherscan.io/tx/0x5678',
        status: 'fail',
    },
    {
        hash: '0x90ab...ijkl',
        url: 'https://etherscan.io/tx/0x90ab',
        status: 'success',
    },
];

export const TransactionsPanel: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<any>(false)

    // Uncomment this when ready to fetch real data
    useEffect(() => {
      const fetchTransactions = async () => {
        setLoading(true)
        try {
          const transactions: any = await invoke('get_transactions');
          console.log(transactions)
          
          setTransactions(transactions);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setLoading(false)
        }
      };
      fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div>
                loading txns...
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full m-4">
            {transactions.map((tx, index) => (
                <div
                    key={index}
                    className={`alert w-full ${tx.status === 'fail' ? 'alert-error' : 'alert-success'} rounded-lg`}
                >
                    <div className="flex-1">
                        <div className="font-mono">{tx}</div>
                    </div>
                    <a
                        href={`https://flowdiver.io/${tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                    >
                        View
                    </a>
                </div>
            ))}
        </div>
    );
};

export default TransactionsPanel;
