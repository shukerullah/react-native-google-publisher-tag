import React from "react";
import { Linking } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";

import util from "./util";

type Props = {
  adUnitId: string,
  adUnitSize: string,
  adUnitTargeting: ?Object,
  baseUrl: ?string,
  backgroundColor: ?string,
  onPress?: Function,
  onLoad?: Function,
  ...WebViewProps,
};

type State = {
  height: number,
};
export default class GPT extends React.PureComponent<Props, State> {
  webView: WebView;

  initialUrl;

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  async _onPress(url) {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
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
      if (nativeEvent.data === "false") {
        return;
      }
      if (nativeEvent.data === "slotOnload" && this.props.onLoad) {
        this.props.onLoad();
      }

      const data = JSON.parse(nativeEvent.data);

      /* eslint-disable radix */
      const height = parseInt(data.height);
      /* eslint-enable */

      if (height !== this.state.height) {
        this.setState({ height });
      }
    } catch (e) {}
  };

  render() {
    const {
      baseUrl,
      adUnitId,
      adUnitSize,
      adUnitTargeting,
      backgroundColor,
      ...rest
    } = this.props;
    const { height } = this.state;

    const style = {
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
          html: util(adUnitId, adUnitSize, adUnitTargeting, backgroundColor),
        }}
        onNavigationStateChange={this._onNavigationChange}
      />
    );
  }
}
