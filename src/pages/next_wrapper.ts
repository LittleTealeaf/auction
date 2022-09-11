import { NextPage } from "next";


export function WebPage<T = {}>(page: NextPage<T>): NextPage<T> {
  return page;
}


//Include getting the current user id and such
export function AuthenticatedPage<T = {}>(page: NextPage<T>): NextPage<T> {
  return page;
}
