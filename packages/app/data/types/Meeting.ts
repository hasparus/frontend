import { generated } from "..";
import {
  Assign,
  DeepPartial,
  Required,
  StrictOmit,
} from "../../src/lib/utilityTypes";
import { Id } from "./Id";
import { User } from "./User";

type MeetingImageKind = "background" | "banner" | "small";

interface MinimalMeeting
  extends Required<
    DeepPartial<
      StrictOmit<
        generated.meeting,
        "guild" | "participants_aggregate" | "organizer"
      >
    >,
    "id" | "title" | "description"
  > {
  organizer: Pick<generated.user, "name" | "email">;
}

export interface MeetingImage {
  src: string;
  kind: MeetingImageKind;
}

/**
 * UI model for meetings
 */
export interface Meeting
  extends Assign<
    MinimalMeeting,
    {
      // narrowed properties
      id: Id;
      organizer: Pick<User, "name" | "email" | "slug">;
    }
  > {
  // future properties
  image?: MeetingImage;
}

type CopiedProperties = "participants";

export const Meeting = {
  parse<T extends MinimalMeeting>(m: T): Meeting & Pick<T, CopiedProperties> {
    return {
      ...m,
      title: m.title || "",
      description: m.description || "",
      organizer: User.parse(m.organizer),
    };
  },
};
