import { generated } from "..";
import { slugify } from "../../src/lib/slugify";
import {
  Assign,
  DeepPartial,
  Optional,
  StrictOmit,
} from "../../src/lib/utilityTypes";
import { Email } from "./Email";
import { Id } from "./Id";

type GuildKeys = "guilds" | "guilds_aggregate";
type MeetingKeys =
  | "meetings"
  | "meetings_aggregate"
  | "organized_meetings"
  | "organized_meetings_aggregate";
type Irrelevant = "created_at";
type NotNeededInMostCases = "locale";
type IgnoredKeys = GuildKeys | MeetingKeys | Irrelevant | NotNeededInMostCases;

interface MinimalUser
  extends DeepPartial<StrictOmit<generated.user, IgnoredKeys>> {
  name: generated.user["name"];
  email: generated.user["email"];
}

export interface User
  extends Assign<
    Optional<generated.user, IgnoredKeys>,
    {
      // narrowed properties
      uuid?: Id;
      email: Email;
    }
  > {
  // future properties
  avatar?: string;
  slug: string;
}

export const User = {
  avatar(u: Pick<User, "avatar" | "slug">) {
    return (
      u.avatar ||
      `${
        typeof window !== "undefined"
          ? window.location.origin
          : "https://zagrajmy.now.sh"
      }/api/u/avatar/${u.slug}`
    );
  },
  parse(u: MinimalUser): User {
    return {
      ...u,
      slug: slugify(u.name!),
    };
  },
};
