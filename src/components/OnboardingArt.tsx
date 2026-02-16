import { ComponentType } from "react";
import DevProductivityArt from "../assets/illustrations/undraw_dev-productivity_5wps.svg";
import { useAppTheme } from "../theme/ThemeProvider";
import { SvgProps } from "react-native-svg";

type Props = {
  Art?: ComponentType<SvgProps>;
};

export function OnboardingArt({ Art = DevProductivityArt }: Props) {
  const { colors } = useAppTheme();

  return <Art width="100%" height={180} color={colors.primary} />;
}
