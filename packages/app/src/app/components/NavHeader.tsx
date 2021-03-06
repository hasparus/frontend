import { alpha } from "@theme-ui/color";
import { Link } from "next-next-link";
import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import {
  assertLanguageIsSupported,
  SUPPORTED_LANGUAGES,
  useLanguage,
} from "../../i18n";
import { summon } from "../../lib";
import { Select, SelectProps } from "../../ui";
import type { Claims } from "../auth";
import { useAppState } from "../store";
import { HeaderFooterListItem } from "./HeaderFooterListItem";
import { Menu } from "./Menu";
import { NavLink } from "./NavLink";

interface LanguagePickerProps
  extends Omit<SelectProps, "ref" | "onChange" | "value"> {}
const LanguagePicker = (props: LanguagePickerProps) => {
  const { i18n } = useTranslation();
  const lang = useLanguage();

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { value } = event.target;

    assertLanguageIsSupported(value);

    i18n.changeLanguage(value);
    summon("/api/u/me", {
      method: "PATCH",
      json: {
        locale: value,
      },
    })
      .then(() => {
        // temporary lazy solution
        // window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        // TODO: Rollback application if it failed
        // TODO: Display error toast
      });
  };

  return (
    <Select
      variant="select-small"
      sx={{
        color: alpha("white", 0.85),
        py: "0.75rem",
        px: 2,
        textAlignLast: "center",
        textTransform: "uppercase",
        fontSize: "0.9em",
        ":hover, :focus": {
          color: "white",
        },
        option: {
          backgroundColor: "gray.1",
          color: "text",
        },
      }}
      value={lang}
      onChange={handleChange}
      {...props}
    >
      {SUPPORTED_LANGUAGES.map((l) => (
        <option key={l}>{l}</option>
      ))}
    </Select>
  );
};

export interface NavHeaderProps extends ComponentProps<"header"> {
  claims: Claims | undefined | null;
  links?: string[];
}

export const NavHeader = ({
  claims: propsClaims,
  links = [],
  ...rest
}: NavHeaderProps) => {
  const { t } = useTranslation();
  const state = useAppState();

  const claims = state.user || propsClaims;

  return (
    <header {...rest}>
      <nav
        sx={{
          bg: "gray.9",
          boxShadow: "inset 0 -1px 0 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        <ul
          sx={{
            height: "68px",
            px: 2,
            margin: 0,
            display: "flex",
            alignItems: "center",
            listStyle: "none",

            maxWidth: 1120,
            mx: "auto",
          }}
        >
          <HeaderFooterListItem sx={{ flex: 1, textAlign: "left" }}>
            <Link href="/">{t("page-title")}</Link>
          </HeaderFooterListItem>
          <HeaderFooterListItem>
            <LanguagePicker />
          </HeaderFooterListItem>
          {links.map((s) => (
            <HeaderFooterListItem key={s}>
              <NavLink href={`/${s}`}>{t(s)}</NavLink>
            </HeaderFooterListItem>
          ))}
          <HeaderFooterListItem>
            {claims ? (
              <Menu claims={claims} />
            ) : (
              <Link
                href="/api/login"
                sx={{
                  display: "block",
                  p: "0.35em 0.15em",
                  cursor: "pointer",
                  "& > div": {
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    borderRadius: "rounded",
                    padding: "0.4em 0.6em",
                  },
                  "&:hover > div": {
                    bg: "white",
                    color: "gray.9",
                  },
                }}
              >
                <div>{t("log-in")}</div>
              </Link>
            )}
          </HeaderFooterListItem>
        </ul>
      </nav>
    </header>
  );
};
