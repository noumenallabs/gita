import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

import { Link as RouterLink } from "expo-router";
import Animated from "react-native-reanimated";
import React from "react";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TouchableHighlight as RNTouchableHighlight,
  TextInput as RNTextInput,
  StyleSheet,
  FlatList as RNFlatList,
  SectionList as RNSectionList,
  RefreshControl as RNRefreshControl,
  ActivityIndicator as RNActivityIndicator,
  Switch as RNSwitch,
  Modal as RNModal,
} from "react-native";

// CSS Variable hook
export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

// CSS-enabled Link
export const Link = (
  props: React.ComponentProps<typeof RouterLink> & { className?: string }
) => {
  return useCssElement(RouterLink, props, { className: "style" });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

// View
export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, { className: "style" });
};
View.displayName = "CSS(View)";

// Text
export const Text = (
  props: React.ComponentProps<typeof RNText> & { className?: string }
) => {
  return useCssElement(RNText, props, { className: "style" });
};
Text.displayName = "CSS(Text)";

// ScrollView
export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNScrollView, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
};
ScrollView.displayName = "CSS(ScrollView)";

// Pressable
export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string }
) => {
  return useCssElement(RNPressable, props, { className: "style" });
};
Pressable.displayName = "CSS(Pressable)";

// TextInput
export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string }
) => {
  return useCssElement(RNTextInput, props, { className: "style" });
};
TextInput.displayName = "CSS(TextInput)";

// FlatList
export const FlatList = <T extends any>(
  props: React.ComponentProps<typeof RNFlatList<T>> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNFlatList, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
};
FlatList.displayName = "CSS(FlatList)";

// SectionList
export const SectionList = <T extends any>(
  props: React.ComponentProps<typeof RNSectionList<T>> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNSectionList, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
};
SectionList.displayName = "CSS(SectionList)";

// ActivityIndicator
export const ActivityIndicator = (
  props: React.ComponentProps<typeof RNActivityIndicator> & { className?: string }
) => {
  return useCssElement(RNActivityIndicator, props, { className: "style" });
};
ActivityIndicator.displayName = "CSS(ActivityIndicator)";

// Switch
export const Switch = (
  props: React.ComponentProps<typeof RNSwitch> & { className?: string }
) => {
  return useCssElement(RNSwitch, props, { className: "style" });
};
Switch.displayName = "CSS(Switch)";

// Modal
export const Modal = (
  props: React.ComponentProps<typeof RNModal> & { className?: string }
) => {
  return useCssElement(RNModal, props, { className: "style" });
};
Modal.displayName = "CSS(Modal)";

// TouchableHighlight with underlayColor extraction
function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight>
) {
  const { underlayColor, ...style } = StyleSheet.flatten(props.style) || {};
  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight>
) => {
  return useCssElement(XXTouchableHighlight, props, { className: "style" });
};
TouchableHighlight.displayName = "CSS(TouchableHighlight)";

// Animated components
export const AnimatedView = RNAnimated.createAnimatedComponent(View);
export const AnimatedText = RNAnimated.createAnimatedComponent(Text);
export const AnimatedScrollView = (
  props: React.ComponentProps<typeof Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(Animated.ScrollView, props, {
    className: "style",
    contentClassName: "contentContainerStyle",
    contentContainerClassName: "contentContainerStyle",
  });
};
