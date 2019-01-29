import React from "react";
import {Animated, UIManager, ViewStyle} from "react-native";
import {compose} from "recompose";

export interface PullAnimationProps {
  styleProps?: ViewStyle;
  xValues: {from?: number; to?: number};
  yValues: {from?: number; to?: number};
  isRefreshing?: boolean;
  minPullDistance?: number;
  scrollY?: Animated.Value;
}

type BaseComponentProps = PullAnimationProps;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const BaseComponent: React.SFC<BaseComponentProps> = ({styleProps, isRefreshing, scrollY, minPullDistance, yValues, xValues, children}) => (
  <Animated.View
    style={[
      styleProps,
      {
        top: scrollY.interpolate({
          inputRange: [-minPullDistance, 0],
          outputRange: [yValues.to || yValues.to === 0 ? yValues.to : yValues.from, yValues.from],
          extrapolate: "clamp",
        }),
        left: xValues.from,
        position: "absolute",
      },
    ]}
  >
    {React.Children.map(children, (child) => {
      return React.cloneElement(child as any, {
        isRefreshing,
        scrollY,
        minPullDistance,
      });
    })}
  </Animated.View>
);

export const PullAnimation = compose<BaseComponentProps, PullAnimationProps>()(BaseComponent);