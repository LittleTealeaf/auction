import { NextPage } from "next";


//Include getting the current user id and such
export function AuthenticatedPage<T = {}>(page: NextPage<T>): NextPage<T> {
  return page;
}


// If not authenticated, then redirect to the user login
// export function AuthenticatedServerSideProps
