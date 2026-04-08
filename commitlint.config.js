module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改 bug 的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建系统或外部依赖项的更改
        'ci', // CI 配置文件和脚本的更改
      ],
    ],
    // type 的字符案例：[2, 'always', 'lower-case'] -> 必须小写
    'type-case': [2, 'always', 'lower-case'],

    // type 是否允许为空：[2, 'never'] -> 类型不能为空
    'type-empty': [2, 'never'],

    // scope 是否允许为空：[0] -> 禁用校验（允许为空，不强制填写范围）
    'scope-empty': [0],

    // scope 的字符案例：[2, 'always', 'lower-case'] -> 如果填写了范围，必须小写
    'scope-case': [2, 'always', 'lower-case'],

    // subject 是否允许为空：[2, 'never'] -> 提交的描述内容不能为空
    'subject-empty': [2, 'never'],

    // subject 结尾是否有句号：[0, 'never'] -> 禁用校验（不强制结尾不能有句号）
    'subject-full-stop': [0, 'never'],

    // subject 的字符案例：[0, 'never'] -> 禁用校验（描述内容不限制大小写）
    'subject-case': [0, 'never'],

    // header（提交信息第一行）的最大长度：[2, 'always', 100] -> 不得超过 100 个字符
    'header-max-length': [2, 'always', 100],
  },
};
