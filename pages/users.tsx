import { User } from "@prisma/client";
import ForbiddenPage from "components/screen/forbidden";
import { fetchAPI, getStatusJson } from "lib/app/fetch";
import { FC, useEffect, useState } from "react";
import { AppPage } from "types/app";



const Page: AppPage = ({user}) => {

    if(!user.manageUsers) return <ForbiddenPage />
    return <PageContent />
}

const PageContent: FC = ({}) => {

    const [users, setUsers] = useState<User[] | undefined>(undefined);

    function loadUsers() {
        fetchAPI('GET','api/user').then(getStatusJson(200)).then(setUsers);
    }

    useEffect(loadUsers,[]);

    return <>awef</>
}



export default Page;
