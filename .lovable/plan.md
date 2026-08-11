# 通过 GitHub 同步下载项目代码

这是平台操作，不涉及项目代码改动。按以下步骤即可把完整代码拉到本地。

## 步骤

1. 在编辑器底部的聊天输入框，点击左下角的 **加号 (+)**。
2. 选择 **GitHub → Connect project（连接项目）**。
3. 跳转到 GitHub 后，授权 **Lovable GitHub App**。
4. 选择要创建仓库的 GitHub 账号或组织。
5. 回到 Lovable，点击 **Create Repository**，Lovable 会把当前项目的全部代码推送到这个新仓库。
6. 打开该 GitHub 仓库：
   - 直接下载：点 **Code → Download ZIP**
   - 或本地克隆：`git clone https://github.com/<你的账号>/<仓库名>.git`
7. 本地安装依赖并运行：
   ```text
   npm install
   npm run dev
   ```

## 说明

- 连接后是**双向同步**：在 Lovable 的改动会自动推到 GitHub，在 GitHub 的提交也会同步回 Lovable。
- 一个 Lovable 账号同一时间只能连接一个 GitHub 账号。
- 数据库数据不包含在代码仓库中，需要单独在 Cloud → Advanced settings → Export data 导出。

## 下一步

如果你希望我在连接完成后，为项目补充本地运行所需的 README 说明文档，告诉我即可。
