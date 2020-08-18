import React from "react";
import { Linking } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";

import publisher from "./publisher";

function getAdUnitTargeting(adUnitTargeting) {
  if (!adUnitTargeting) {
    return "";
  }
  const unitTargeting = [];
  Object.keys(adUnitTargeting).forEach((key) => {
    let value = adUnitTargeting[key];
    // Array
    if (Array.isArray(value)) {
      value = value.map((val) => `"${val}"`);
      value = `[${value}]`;
    }
    // String
    else if (typeof value === "string") {
      value = `"${value}"`;
    }
    unitTargeting.push(`.setTargeting("${key}", ${value})`);
  });
  return unitTargeting.join("");
}

type Props = {
  adUnitId: string,
  adUnitSize: string,
  adUnitTargeting: ?Object,
  baseUrl: ?string,
  backgroundColor: ?string,
  onPress: ?Function,
  impressionViewable?: Function,
  slotOnload?: Function,
  slotRenderEnded?: Function,
  slotRequested?: Function,
  slotResponseReceived?: Function,
  slotVisibilityChanged?: Function,
  ...WebViewProps,
};

type State = {
  width: number,
  height: number,
};
export default class GPT extends React.PureComponent<Props, State> {
  webView: WebView;

  initialUrl;

  html;

  static defaultProps = {
    impressionViewable: () => {},
    slotOnload: () => {},
    slotRenderEnded: () => {},
    slotRequested: () => {},
    slotResponseReceived: () => {},
    slotVisibilityChanged: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      width: "100%",
      height: 0,
    };

    this.html = publisher(
      props.adUnitId,
      props.adUnitSize,
      getAdUnitTargeting(props.adUnitTargeting),
      props.backgroundColor
    );
  }

  _onNavigationChange = ({ url }) => {
    if (!this.initialUrl) {
      this.initialUrl = url;
    } else if (this.initialUrl !== url) {
      this.webView.stopLoading();
      if (this.props.onPress) {
        this.props.onPress(url);
      } else {
        this._onPress(url);
      }
    }
  };

  _onMessage = (info: Object) => {
    if (this.props.onMessage) {
      this.props.onMessage(info);
    }

    try {
      const { nativeEvent } = info;
      const data = JSON.parse(nativeEvent.data);

      if (data.height) {
        const { height } = data;
        if (height !== this.state.height) {
          this.setState({
            height,
          });
        }
      }

      if (data.impressionViewable) {
        this.props.impressionViewable(data.impressionViewable);
      }

      if (data.slotOnload) {
        this.props.slotOnload(data.slotOnload);
      }

      if (data.slotRenderEnded) {
        this.props.slotRenderEnded(data.slotRenderEnded);
        const width = data.slotRenderEnded.size[0];
        const height = data.slotRenderEnded.size[1];
        const isFluid = width === 0 && height === 0;
        if (
          !isFluid &&
          (width !== this.state.width || height !== this.state.height)
        ) {
          this.setState({
            width,
            height,
          });
        }
      }

      if (data.slotRequested) {
        this.props.slotRequested(data.slotRequested);
      }

      if (data.slotResponseReceived) {
        this.props.slotResponseReceived(data.slotResponseReceived);
      }

      if (data.slotVisibilityChanged) {
        this.props.slotVisibilityChanged(data.slotVisibilityChanged);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  async _onPress(url) {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }

  render() {
    const { baseUrl, ...rest } = this.props;
    const { width, height } = this.state;
    const style = {
      width,
      height,
    };

    return (
      <WebView
        ref={(ref) => {
          this.webView = ref;
        }}
        style={style}
        bounces={false}
        scrollEnabled={false}
        {...rest}
        onMessage={this._onMessage}
        source={{
          baseUrl,
          html: this.html,
        }}
        onNavigationStateChange={this._onNavigationChange}
      />
    );
  }
}
