/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** 发送验证码请求参数 */
export interface VerificationCodeSendReq {
  /**
   * 接受验证码方
   * 邮箱，最大长度 254
   * @minLength 0
   * @maxLength 254
   */
  recipient?: string;
  /**
   * 验证码使用场景
   * LOGIN:登录场景
   */
  verificationCodeSceneEnum?: VerificationCodeSendReqVerificationCodeSceneEnumEnum;
}

export interface ResultWrapperVerificationCodeSendResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: VerificationCodeSendResp;
}

/** 发送验证码请求结果 */
export interface VerificationCodeSendResp {
  /**
   * 过期时间点，整形秒级时间戳
   * @format int64
   * @example 1701183505
   */
  expireAt?: number;
}

export interface ResultWrapperUserTokenResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  /** 登录或者刷新令牌会返回 */
  data?: UserTokenResp;
}

/**
 * 用户令牌返回值
 * 登录或者刷新令牌会返回
 */
export interface UserTokenResp {
  /**
   * 刷新令牌
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e2fQ.4J2Y"
   */
  refreshToken?: string;
  /**
   * 访问令牌
   * @example "eyJzdWIiOiIwOTg3NjU0MzIxIiwibmF.fS9f9Jc.6sVw8FtZ9UYKTAx0lXY"
   */
  accessToken?: string;
}

export interface ResultWrapperVoid {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: object;
}

/** 用户登录请求参数 */
export interface UserLoginReq {
  /**
   * 登录类型
   * 1: 密码登录
   * 2: 验证码登录(包含邮箱验证码，短信验证码)
   * 3: Google登录
   * 4: Apple登录
   * 5: 微信登录
   * @format int32
   * @example 1
   */
  loginType: number;
  /**
   * 用户名
   * 当使用密码或验证码登录时候必须;有可能是用户名、手机号、邮箱，最大长度 254
   * @minLength 0
   * @maxLength 254
   * @example "+86-17388889999"
   */
  username?: string;
  /**
   * 密码
   * 密码登录的时候必须;值为原始密码字符串进行 sha-256 计算后的16进制的表示形式，长度为 64
   * @minLength 64
   * @maxLength 64
   * @example "9d5e3a7ffe5b0e8e9a2a6c7c6c5e4a0b3c6d2e5f8a1e7b2f6d8c3b4a1f9e0f9"
   */
  password?: string;
  /**
   * 验证码
   * 验证码登录的时候必须;
   * @minLength 4
   * @maxLength 6
   * @example "666888"
   */
  verificationCode?: string;
  /** 第三方登录Token */
  thirdPartToken?: string;
}

/** 外部系统获取签名请求参数 */
export interface ExternalSystemSigReq {
  /**
   * 外部系统用户ID
   * 外部系统的用户ID
   * @minLength 0
   * @maxLength 128
   * @example "ext_user_123456"
   */
  externalUserId: string;
  /**
   * 外部系统标识
   * 外部系统标识，目前支持：LANGUAGE_EDUCATION（语言教育平台）
   * @example "LANGUAGE_EDUCATION"
   */
  externalSystem: string;
}

export interface PageQueryWrapperTopicDiscussionConditionReq {
  /** @format int32 */
  current?: number;
  /** @format int32 */
  size?: number;
  lastIndex?: string;
  /** @format int32 */
  direction?: number;
  condition?: TopicDiscussionConditionReq;
  sorts?: SortField[];
}

export interface SortField {
  field?: string;
  asc?: boolean;
}

/** 话题探讨筛选条件 */
export type TopicDiscussionConditionReq = object;

export interface PageResultWrapperTopicDiscussionResp {
  /** @format int64 */
  current?: number;
  /** @format int64 */
  size?: number;
  /** @format int64 */
  total?: number;
  /** @format int64 */
  pages?: number;
  records?: TopicDiscussionResp[];
}

export interface ResultWrapperPageResultWrapperTopicDiscussionResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: PageResultWrapperTopicDiscussionResp;
}

/** 话题探讨信息 */
export interface TopicDiscussionResp {
  /**
   * 话题编号
   * @example "TOPIC001"
   */
  topicNo?: string;
  /**
   * 话题名称
   * @example "日常英语对话练习"
   */
  topicTitle?: string;
  /**
   * 话题介绍
   * @example "通过日常场景对话，提升英语口语表达能力"
   */
  topicDesc?: string;
  /**
   * 绑定的数字人ID
   * @example "AVATAR001"
   */
  bindAvatarId?: string;
  /** IM消息业务类型 */
  bizType?: string;
  /** 业务ID */
  bizId?: string;
}

export interface PageQueryWrapperSceneCommunicationConditionReq {
  /** @format int32 */
  current?: number;
  /** @format int32 */
  size?: number;
  lastIndex?: string;
  /** @format int32 */
  direction?: number;
  condition?: SceneCommunicationConditionReq;
  sorts?: SortField[];
}

/** 场景实战筛选条件 */
export type SceneCommunicationConditionReq = object;

export interface PageResultWrapperSceneCommunicationResp {
  /** @format int64 */
  current?: number;
  /** @format int64 */
  size?: number;
  /** @format int64 */
  total?: number;
  /** @format int64 */
  pages?: number;
  records?: SceneCommunicationResp[];
}

export interface ResultWrapperPageResultWrapperSceneCommunicationResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: PageResultWrapperSceneCommunicationResp;
}

/** 场景实战信息 */
export interface SceneCommunicationResp {
  /**
   * 场景编号
   * @example "SCENE001"
   */
  sceneNo?: string;
  /**
   * 场景标题
   * @example "机场接机场景"
   */
  sceneTitle?: string;
  /**
   * 场景描述
   * @example "模拟在机场接机时的英语对话场景"
   */
  sceneDesc?: string;
  /**
   * 场景图片URL
   * @example "https://example.com/scene-image.jpg"
   */
  sceneImage?: string;
  /**
   * 场景位置
   * @example "机场"
   */
  sceneLocation?: string;
  /**
   * 数字人角色
   * @example "机场工作人员"
   */
  avatarRole?: string;
  /**
   * 用户角色
   * @example "旅客"
   */
  userRole?: string;
  /**
   * 绑定的数字人ID
   * @example "AVATAR001"
   */
  bindAvatarId?: string;
  /** IM消息业务类型 */
  bizType?: string;
  /** 业务ID */
  bizId?: string;
}

/** 辩论比赛筛选条件 */
export type DebateCompetitionConditionReq = object;

export interface PageQueryWrapperDebateCompetitionConditionReq {
  /** @format int32 */
  current?: number;
  /** @format int32 */
  size?: number;
  lastIndex?: string;
  /** @format int32 */
  direction?: number;
  condition?: DebateCompetitionConditionReq;
  sorts?: SortField[];
}

/** 辩论比赛信息 */
export interface DebateCompetitionResp {
  /**
   * 辩论编号
   * @example "DEBATE001"
   */
  debateNo?: string;
  /**
   * 辩论主题
   * @example "人工智能是否会取代人类工作"
   */
  debateTopic?: string;
  /**
   * 正方观点
   * @example "人工智能将提高工作效率，创造新的就业机会"
   */
  proponentView?: string;
  /**
   * 正方图片URL
   * @example "https://example.com/proponent-image.jpg"
   */
  proponentImage?: string;
  /**
   * 反方观点
   * @example "人工智能会导致大量失业，社会不稳定"
   */
  opponentView?: string;
  /**
   * 反方图片URL
   * @example "https://example.com/opponent-image.jpg"
   */
  opponentImage?: string;
  /**
   * 绑定的数字人ID
   * @example "AVATAR001"
   */
  bindAvatarId?: string;
  /** IM消息业务类型 */
  bizType?: string[];
  /** 业务ID */
  bizId?: string;
}

export interface PageResultWrapperDebateCompetitionResp {
  /** @format int64 */
  current?: number;
  /** @format int64 */
  size?: number;
  /** @format int64 */
  total?: number;
  /** @format int64 */
  pages?: number;
  records?: DebateCompetitionResp[];
}

export interface ResultWrapperPageResultWrapperDebateCompetitionResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: PageResultWrapperDebateCompetitionResp;
}

/** 会话创建参数 */
export interface ConversionCreateReq {
  /** 虚拟人 id  */
  avatarId?: string;
  /**
   * 消息业务类型
   * AVATAR, TOPIC, SCENE, DEBATE
   */
  bizType?: string;
  /**
   * 关联的业务ID
   * 主题编号topicNo,场景编号sceneNo,debateNo辩论编号
   */
  bizId?: string;
}

/** 消息 */
export interface ConversionTextReq {
  /** 消息文本 */
  msgText?: string;
  /** 数字人id（朗读取音色） */
  avatarId?: string;
}

/** 会话消息翻译 */
export interface ConversationMessageTranslateResp {
  /** 消息原内容 */
  msgContent?: string;
  /** 消息翻译后内容 */
  translatedMsgContent?: string;
  /** 消息目标语种 */
  targetLang?: string;
}

export interface ResultWrapperConversationMessageTranslateResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: ConversationMessageTranslateResp;
}

/** 会话消息音频 */
export interface ConversationMessageAudioResp {
  /** 音频地址 */
  url?: string;
  /**
   * 音频时长
   * @format int64
   */
  duration?: number;
}

export interface ResultWrapperConversationMessageAudioResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: ConversationMessageAudioResp;
}

/** 虚拟人筛选条件 */
export interface AvatarConditionReq {
  /**
   * 性别
   * MALE-男, FEMALE-女
   */
  avatarSex?: string;
  /**
   * 语言
   * zh, en
   */
  languageCode?: string;
}

export interface PageQueryWrapperAvatarConditionReq {
  /** @format int32 */
  current?: number;
  /** @format int32 */
  size?: number;
  lastIndex?: string;
  /** @format int32 */
  direction?: number;
  condition?: AvatarConditionReq;
  sorts?: SortField[];
}

/** 虚拟人信息 */
export interface AvatarInfoResp {
  /** 虚拟人id */
  avatarId?: string;
  /** 虚拟人昵称 */
  avatarNickname?: string;
  /**
   * 头像URL
   * @example "https://example.com/avatar.jpg"
   */
  avatarHeadPortrait?: string;
  /**
   * 性别
   * @example "female"
   */
  avatarSex?: AvatarInfoRespAvatarSexEnum;
  /**
   * 年龄
   * @format int32
   * @example 25
   */
  age?: number;
  /**
   * 自我介绍（第一人称）
   * @example "你好，我是艾米，很高兴和你一起学习英语！"
   */
  selfIntroduction?: string;
  /**
   * 虚拟人形象图片URL
   * @example "https://example.com/full-image.jpg"
   */
  avatarImageUrl?: string;
  /**
   * 语言代码
   * @example "en"
   */
  languageCode?: string;
  /**
   * 标签列表
   * @example "职业、性格、爱好 等系列标签"
   */
  tagList?: TagResp[];
  /** im数字人id */
  imAvatarId?: string;
  /**
   * 创建时间
   * @format int64
   */
  createdAt?: number;
  /** IM消息业务类型 */
  bizType?: string;
  /** 消息业务ID */
  bizId?: string;
}

export interface PageResultWrapperAvatarInfoResp {
  /** @format int64 */
  current?: number;
  /** @format int64 */
  size?: number;
  /** @format int64 */
  total?: number;
  /** @format int64 */
  pages?: number;
  records?: AvatarInfoResp[];
}

export interface ResultWrapperPageResultWrapperAvatarInfoResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: PageResultWrapperAvatarInfoResp;
}

/**
 * 标签信息
 * @example "职业、性格、爱好 等系列标签"
 */
export interface TagResp {
  /** 标签编码 */
  tagCode?: string;
  /** 标签名字 */
  tagName?: string;
}

export interface ResultWrapperUserInfoResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: UserInfoResp;
}

/** 用户信息 */
export interface UserInfoResp {
  /** 用户 id */
  userId?: string;
  /** 用户昵称 */
  nickname?: string;
  /** 头像 */
  headPortrait?: string;
  /** im用户id */
  imUserId?: string;
}

export interface ResultWrapperUserInfoSigResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: UserInfoSigResp;
}

/** 用户userSig信息 */
export interface UserInfoSigResp {
  /** 用户userSig */
  userSig?: string;
  /** im用户id */
  imUserId?: string;
  /**
   * sdkAppId
   * @format int64
   */
  sdkAppId?: number;
}

export interface ResultWrapperAvatarInfoResp {
  /** @format int32 */
  code?: number;
  msg?: string;
  data?: AvatarInfoResp;
}

/**
 * 验证码使用场景
 * LOGIN:登录场景
 */
export type VerificationCodeSendReqVerificationCodeSceneEnumEnum = "LOGIN";

/**
 * 性别
 * @example "female"
 */
export type AvatarInfoRespAvatarSexEnum = "male" | "female" | "unknown";

export type ImPayload = Record<string, object>;

export interface ImParams {
  SdkAppid: string;
  CallbackCommand: string;
  contenttype?: string;
  ClientIP?: string;
  OptPlatform?: string;
  RequestId?: string;
}

export interface GetAvatarInfoParams {
  /** 虚拟数字人id */
  avatarId: string;
}

export namespace Api {
  /**
   * No description
   * @tags 用户账号相关接口
   * @name SendVerificationCode
   * @summary 发送验证码
   * @request POST:/api/speakami/user/account/sendVerificationCode
   * @response `200` `ResultWrapperVerificationCodeSendResp` OK
   */
  export namespace SendVerificationCode {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerificationCodeSendReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperVerificationCodeSendResp;
  }

  /**
   * No description
   * @tags 用户账号相关接口
   * @name RefreshToken
   * @summary 刷新访问令牌
   * @request POST:/api/speakami/user/account/refreshToken
   * @response `default` `ResultWrapperUserTokenResp` default response
   */
  export namespace RefreshToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** 当非 web 端调用时候使用 X-Refresh-Token 请求头；web 端使用 refreshToken cookie  */
      refreshToken: string;
    };
    export type ResponseBody = ResultWrapperUserTokenResp;
  }

  /**
   * No description
   * @tags 用户账号相关接口
   * @name Logout
   * @summary 用户退出登录
   * @request POST:/api/speakami/user/account/logout
   * @response `200` `ResultWrapperVoid` OK
   */
  export namespace Logout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperVoid;
  }

  /**
   * No description
   * @tags 用户账号相关接口
   * @name Login
   * @summary 用户登录
   * @request POST:/api/speakami/user/account/login
   * @response `default` `ResultWrapperUserTokenResp` default response
   */
  export namespace Login {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserLoginReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperUserTokenResp;
  }

  /**
   * @description 外部业务系统传入外部系统的userId，本系统颁发jwt token，通过jwt的受众指定上游系统
   * @tags 用户账号相关接口
   * @name GetExternalUserToken
   * @summary 外部系统获取签名
   * @request POST:/api/speakami/user/account/getExternalUserToken
   * @response `default` `ResultWrapperUserTokenResp` default response
   */
  export namespace GetExternalUserToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ExternalSystemSigReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperUserTokenResp;
  }

  /**
   * No description
   * @tags 话题探讨相关接口
   * @name PageTopicDiscussionList
   * @summary 话题探讨列表分页查询
   * @request POST:/api/speakami/talk/pageTopicDiscussionList
   * @response `200` `ResultWrapperPageResultWrapperTopicDiscussionResp` OK
   */
  export namespace PageTopicDiscussionList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PageQueryWrapperTopicDiscussionConditionReq;
    export type RequestHeaders = {};
    export type ResponseBody =
      ResultWrapperPageResultWrapperTopicDiscussionResp;
  }

  /**
   * No description
   * @tags 话题探讨相关接口
   * @name PageSceneCommunicationList
   * @summary 场景实战列表分页查询
   * @request POST:/api/speakami/talk/pageSceneCommunicationList
   * @response `200` `ResultWrapperPageResultWrapperSceneCommunicationResp` OK
   */
  export namespace PageSceneCommunicationList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PageQueryWrapperSceneCommunicationConditionReq;
    export type RequestHeaders = {};
    export type ResponseBody =
      ResultWrapperPageResultWrapperSceneCommunicationResp;
  }

  /**
   * No description
   * @tags 话题探讨相关接口
   * @name PageDebateCompetitionList
   * @summary 辩论比赛列表分页查询
   * @request POST:/api/speakami/talk/pageDebateCompetitionList
   * @response `200` `ResultWrapperPageResultWrapperDebateCompetitionResp` OK
   */
  export namespace PageDebateCompetitionList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PageQueryWrapperDebateCompetitionConditionReq;
    export type RequestHeaders = {};
    export type ResponseBody =
      ResultWrapperPageResultWrapperDebateCompetitionResp;
  }

  /**
   * No description
   * @tags 对话消息相关接口
   * @name TryCreateConversion
   * @summary 尝试创建创建会话
   * @request POST:/api/speakami/conversation/message/tryCreateConversion
   * @response `200` `ResultWrapperVoid` OK
   */
  export namespace TryCreateConversion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConversionCreateReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperVoid;
  }

  /**
   * No description
   * @tags 对话消息相关接口
   * @name GetMessageTranslate
   * @summary 获取消息翻译
   * @request POST:/api/speakami/conversation/message/getMessageTranslate
   * @response `200` `ResultWrapperConversationMessageTranslateResp` OK
   */
  export namespace GetMessageTranslate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConversionTextReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperConversationMessageTranslateResp;
  }

  /**
   * No description
   * @tags 对话消息相关接口
   * @name GetMessageAudio
   * @summary 获取消息音频
   * @request POST:/api/speakami/conversation/message/getMessageAudio
   * @response `200` `ResultWrapperConversationMessageAudioResp` OK
   */
  export namespace GetMessageAudio {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConversionTextReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperConversationMessageAudioResp;
  }

  /**
   * No description
   * @tags im回调相关接口
   * @name Im
   * @request POST:/api/speakami/callback/im
   * @response `200` `Record<string,object>` OK
   */
  export namespace Im {
    export type RequestParams = {};
    export type RequestQuery = {
      SdkAppid: string;
      CallbackCommand: string;
      contenttype?: string;
      ClientIP?: string;
      OptPlatform?: string;
      RequestId?: string;
    };
    export type RequestBody = ImPayload;
    export type RequestHeaders = {};
    export type ResponseBody = Record<string, object>;
  }

  /**
   * No description
   * @tags AI数字人相关接口
   * @name PageAvatarList
   * @summary 数字人语伴列表查询
   * @request POST:/api/speakami/avatar/pageAvatarList
   * @response `200` `ResultWrapperPageResultWrapperAvatarInfoResp` OK
   */
  export namespace PageAvatarList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PageQueryWrapperAvatarConditionReq;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperPageResultWrapperAvatarInfoResp;
  }

  /**
   * No description
   * @tags 用户信息相关接口
   * @name GetUserInfo
   * @summary 获取用户信息
   * @request GET:/api/speakami/user/info/getUserInfo
   * @response `200` `ResultWrapperUserInfoResp` OK
   */
  export namespace GetUserInfo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperUserInfoResp;
  }

  /**
   * No description
   * @tags 用户信息相关接口
   * @name GetUserInfoSig
   * @summary 获取用户的userSig
   * @request GET:/api/speakami/user/info/getUserInfoSig
   * @response `200` `ResultWrapperUserInfoSigResp` OK
   */
  export namespace GetUserInfoSig {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperUserInfoSigResp;
  }

  /**
   * No description
   * @tags AI数字人相关接口
   * @name GetAvatarInfo
   * @summary 获取虚拟数字人信息
   * @request GET:/api/speakami/avatar/getAvatarInfo
   * @response `200` `ResultWrapperAvatarInfoResp` OK
   */
  export namespace GetAvatarInfo {
    export type RequestParams = {};
    export type RequestQuery = {
      /** 虚拟数字人id */
      avatarId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultWrapperAvatarInfoResp;
  }
}

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format || "json";

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = await response[responseFormat as ResponseFormat]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title No title
 * @version 1.0.0
 * @baseUrl //localhost:8801
 */
export type CancelToken = symbol | string | number;

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl https://dev-speakami.golingo.cn
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags 用户账号相关接口
     * @name SendVerificationCode
     * @summary 发送验证码
     * @request POST:/api/speakami/user/account/sendVerificationCode
     * @response `200` `ResultWrapperVerificationCodeSendResp` OK
     */
    sendVerificationCode: (
      data: VerificationCodeSendReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperVerificationCodeSendResp, any>({
        path: `/api/speakami/user/account/sendVerificationCode`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 用户账号相关接口
     * @name RefreshToken
     * @summary 刷新访问令牌
     * @request POST:/api/speakami/user/account/refreshToken
     * @response `default` `ResultWrapperUserTokenResp` default response
     */
    refreshToken: (params: RequestParams = {}) =>
      this.request<ResultWrapperUserTokenResp, any>({
        path: `/api/speakami/user/account/refreshToken`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 用户账号相关接口
     * @name Logout
     * @summary 用户退出登录
     * @request POST:/api/speakami/user/account/logout
     * @response `200` `ResultWrapperVoid` OK
     */
    logout: (params: RequestParams = {}) =>
      this.request<ResultWrapperVoid, any>({
        path: `/api/speakami/user/account/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 用户账号相关接口
     * @name Login
     * @summary 用户登录
     * @request POST:/api/speakami/user/account/login
     * @response `default` `ResultWrapperUserTokenResp` default response
     */
    login: (data: UserLoginReq, params: RequestParams = {}) =>
      this.request<ResultWrapperUserTokenResp, any>({
        path: `/api/speakami/user/account/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 外部业务系统传入外部系统的userId，本系统颁发jwt token，通过jwt的受众指定上游系统
     *
     * @tags 用户账号相关接口
     * @name GetExternalUserToken
     * @summary 外部系统获取签名
     * @request POST:/api/speakami/user/account/getExternalUserToken
     * @response `default` `ResultWrapperUserTokenResp` default response
     */
    getExternalUserToken: (
      data: ExternalSystemSigReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperUserTokenResp, any>({
        path: `/api/speakami/user/account/getExternalUserToken`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 话题探讨相关接口
     * @name PageTopicDiscussionList
     * @summary 话题探讨列表分页查询
     * @request POST:/api/speakami/talk/pageTopicDiscussionList
     * @response `200` `ResultWrapperPageResultWrapperTopicDiscussionResp` OK
     */
    pageTopicDiscussionList: (
      data: PageQueryWrapperTopicDiscussionConditionReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperPageResultWrapperTopicDiscussionResp, any>({
        path: `/api/speakami/talk/pageTopicDiscussionList`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 话题探讨相关接口
     * @name PageSceneCommunicationList
     * @summary 场景实战列表分页查询
     * @request POST:/api/speakami/talk/pageSceneCommunicationList
     * @response `200` `ResultWrapperPageResultWrapperSceneCommunicationResp` OK
     */
    pageSceneCommunicationList: (
      data: PageQueryWrapperSceneCommunicationConditionReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperPageResultWrapperSceneCommunicationResp, any>({
        path: `/api/speakami/talk/pageSceneCommunicationList`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 话题探讨相关接口
     * @name PageDebateCompetitionList
     * @summary 辩论比赛列表分页查询
     * @request POST:/api/speakami/talk/pageDebateCompetitionList
     * @response `200` `ResultWrapperPageResultWrapperDebateCompetitionResp` OK
     */
    pageDebateCompetitionList: (
      data: PageQueryWrapperDebateCompetitionConditionReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperPageResultWrapperDebateCompetitionResp, any>({
        path: `/api/speakami/talk/pageDebateCompetitionList`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 对话消息相关接口
     * @name TryCreateConversion
     * @summary 尝试创建创建会话
     * @request POST:/api/speakami/conversation/message/tryCreateConversion
     * @response `200` `ResultWrapperVoid` OK
     */
    tryCreateConversion: (
      data: ConversionCreateReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperVoid, any>({
        path: `/api/speakami/conversation/message/tryCreateConversion`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 对话消息相关接口
     * @name GetMessageTranslate
     * @summary 获取消息翻译
     * @request POST:/api/speakami/conversation/message/getMessageTranslate
     * @response `200` `ResultWrapperConversationMessageTranslateResp` OK
     */
    getMessageTranslate: (
      data: ConversionTextReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperConversationMessageTranslateResp, any>({
        path: `/api/speakami/conversation/message/getMessageTranslate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 对话消息相关接口
     * @name GetMessageAudio
     * @summary 获取消息音频
     * @request POST:/api/speakami/conversation/message/getMessageAudio
     * @response `200` `ResultWrapperConversationMessageAudioResp` OK
     */
    getMessageAudio: (data: ConversionTextReq, params: RequestParams = {}) =>
      this.request<ResultWrapperConversationMessageAudioResp, any>({
        path: `/api/speakami/conversation/message/getMessageAudio`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags im回调相关接口
     * @name Im
     * @request POST:/api/speakami/callback/im
     * @response `200` `Record<string,object>` OK
     */
    im: (query: ImParams, data: ImPayload, params: RequestParams = {}) =>
      this.request<Record<string, object>, any>({
        path: `/api/speakami/callback/im`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI数字人相关接口
     * @name PageAvatarList
     * @summary 数字人语伴列表查询
     * @request POST:/api/speakami/avatar/pageAvatarList
     * @response `200` `ResultWrapperPageResultWrapperAvatarInfoResp` OK
     */
    pageAvatarList: (
      data: PageQueryWrapperAvatarConditionReq,
      params: RequestParams = {},
    ) =>
      this.request<ResultWrapperPageResultWrapperAvatarInfoResp, any>({
        path: `/api/speakami/avatar/pageAvatarList`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 用户信息相关接口
     * @name GetUserInfo
     * @summary 获取用户信息
     * @request GET:/api/speakami/user/info/getUserInfo
     * @response `200` `ResultWrapperUserInfoResp` OK
     */
    getUserInfo: (params: RequestParams = {}) =>
      this.request<ResultWrapperUserInfoResp, any>({
        path: `/api/speakami/user/info/getUserInfo`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 用户信息相关接口
     * @name GetUserInfoSig
     * @summary 获取用户的userSig
     * @request GET:/api/speakami/user/info/getUserInfoSig
     * @response `200` `ResultWrapperUserInfoSigResp` OK
     */
    getUserInfoSig: (params: RequestParams = {}) =>
      this.request<ResultWrapperUserInfoSigResp, any>({
        path: `/api/speakami/user/info/getUserInfoSig`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI数字人相关接口
     * @name GetAvatarInfo
     * @summary 获取虚拟数字人信息
     * @request GET:/api/speakami/avatar/getAvatarInfo
     * @response `200` `ResultWrapperAvatarInfoResp` OK
     */
    getAvatarInfo: (query: GetAvatarInfoParams, params: RequestParams = {}) =>
      this.request<ResultWrapperAvatarInfoResp, any>({
        path: `/api/speakami/avatar/getAvatarInfo`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
