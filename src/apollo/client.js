/**
 * Apollo GraphQL 客户端配置
 * 用于连接到 Cloudflare Workers GraphQL 服务端
 */

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL 服务端 URL - 智能检测环境
const getGraphQLURI = () => {
  // 如果设置了环境变量，优先使用
  if (process.env.REACT_APP_GRAPHQL_URI) {
    return process.env.REACT_APP_GRAPHQL_URI;
  }
  
  // 检测当前环境
  const hostname = window.location.hostname;
  
  // 生产环境默认配置
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return 'https://deepseek-graphql-worker.zhuyueseng.workers.dev/graphql';
  }
  
  // 开发环境默认配置
  return 'http://localhost:8787/graphql';
};

const GRAPHQL_URI = getGraphQLURI();

// 创建 HTTP 链接
const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  // 启用凭据传输（如需要身份认证）
  credentials: 'same-origin',
});

// 创建认证链接（可选 - 如果需要 API Key 等认证）
const authLink = setContext((_, { headers }) => {
  // 从环境变量或本地存储获取 token
  const token = process.env.REACT_APP_API_TOKEN;
  
  return {
    headers: {
      ...headers,
      // 如果有 token，添加到请求头
      ...(token && { authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    }
  }
});

// 创建 Apollo Client 实例
const apolloClient = new ApolloClient({
  // 组合链接：认证链接 + HTTP 链接
  link: authLink.concat(httpLink),
  
  // 内存缓存配置
  cache: new InMemoryCache({
    // 类型策略配置
    typePolicies: {
      // ChatResponse 缓存策略
      ChatResponse: {
        // 使用 id 作为缓存键
        keyFields: ['id'],
      },
      // Usage 类型不需要缓存
      Usage: {
        keyFields: false,
      }
    },
  }),
  
  // 开发模式配置
  connectToDevTools: process.env.NODE_ENV === 'development',
  
  // 默认查询选项
  defaultOptions: {
    watchQuery: {
      // 默认缓存策略：优先使用缓存，如果没有则请求网络
      fetchPolicy: 'cache-and-network',
      // 出错时的策略
      errorPolicy: 'all',
    },
    query: {
      // 查询的缓存策略
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    mutate: {
      // 变更的错误策略
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;

// 导出常用的 Apollo Client hooks 和工具
export {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  useSubscription
} from '@apollo/client';