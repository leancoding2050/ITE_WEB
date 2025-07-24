"use client";

import { useEffect, useState } from "react";


const AccountsListsPage = () => {

    const [ GetAccountsData , setGetAccountsData] = useState([]);

    useEffect(() => {
        const  fetchAccountsData = async () => {
            const response = await fetch("/api/Accounts/Get_Accounts_Lists");
            const data = await response.json();
            setGetAccountsData(data);
        }
        fetchAccountsData();
    }, []);


    return (
        <>
            AccountsListsPage
        </>
    )
}

export default AccountsListsPage;