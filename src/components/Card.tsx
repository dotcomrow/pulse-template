"use client";
import styled from "styled-components";
import { shadowOptions } from "interfaces";
import {
  BorderProps,
  ColorProps,
  LayoutProps,
  SpaceProps,
  compose,
  border,
  color,
  space,
  layout,
} from "styled-system";
import Box from "./Box";

export interface CardProps {
  elevation?: number;
  hoverEffect?: boolean;
  boxShadow?: shadowOptions;
}

type Props = ColorProps & SpaceProps & LayoutProps & BorderProps & CardProps;

// const Card = styled(Box)<Props>`
//   background-color: ${({ theme }) => theme.colors.body.paper};
//   box-shadow: ${({ theme, boxShadow, elevation }) =>
//     `${theme.shadows[boxShadow]}, ${theme.shadows[elevation]}`};

//   :hover {
//     box-shadow: ${({ theme, hoverEffect }) => hoverEffect && theme.shadows.large};
//   }

//   ${border}
//   ${color}
//   ${space}
//   ${layout}
// `;

const Card = styled(Box)<Props>(
  ({ theme, hoverEffect = false, boxShadow = "small" }) => ({
    backgroundColor: theme.colors.body.paper,
    boxShadow: theme.shadows[boxShadow ? boxShadow : ""],
    ...(hoverEffect && { ":hover": { boxShadow: theme.shadows.large } }),
  }),
  compose(border, color, space, layout)
);

export default Card;
