import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.log('PostSwiper error:', error, info);
  }
  
  resetError = () => {
    this.setState({ hasError: false });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong with this post.</Text>
          <TouchableOpacity onPress={this.resetError}>
            <Text style={{ color: 'blue', marginTop: 10 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
