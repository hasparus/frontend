import { head } from "fp-ts/lib/Array";
import { toUndefined } from "fp-ts/lib/Option";
import { Db } from "./hasura";
import { ValueTypes } from "./graphql-zeus";

export const queryUserByAuth0Id = <T extends ValueTypes["user"]>(
  query: Db["query"],
  auth0Id: string,
  properties: T
) =>
  query({
    user: [{ where: { auth0_id: { _eq: auth0Id } } }, properties],
  }).then((res) => toUndefined(head(res.user || [])));
