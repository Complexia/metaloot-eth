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
    const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);

    // Uncomment this when ready to fetch real data
    // useEffect(() => {
    //   const fetchTransactions = async () => {
    //     try {
    //       const response = await fetch('http://localhost:8080/get-history');
    //       const data = await response.json();
    //       setTransactions(data);
    //     } catch (error) {
    //       console.error('Error fetching transactions:', error);
    //     }
    //   };
    //   fetchTransactions();
    // }, []);

    return (
        <div className="flex flex-col gap-4 w-full">
            {transactions.map((tx, index) => (
                <div
                    key={index}
                    className={`alert w-full ${tx.status === 'success' ? 'alert-success' : 'alert-error'} rounded-lg`}
                >
                    <div className="flex-1">
                        <div className="font-mono">{tx.hash}</div>
                    </div>
                    <a
                        href={tx.url}
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
