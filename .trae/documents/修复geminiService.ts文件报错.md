# 修复geminiService.ts文件报错

## 问题分析
根据对代码的分析和搜索结果，我发现了以下几个问题：

1. **Type导入错误**：从`@google/genai`直接导入`Type`是不正确的
2. **contents参数格式错误**：`generateContent`方法的`contents`参数应该是包含`parts`的对象数组，而不是直接的字符串
3. **responseSchema格式错误**：使用`Type`来定义responseSchema不是正确的用法

## 修复方案

### 1. 修正导入语句
- 移除`Type`的直接导入
- 使用正确的方式导入Google GenAI库

### 2. 修正generateContent方法调用
- 将`contents`参数从字符串改为包含`parts`的对象数组
- 修正`responseSchema`的定义方式，使用标准JSON Schema格式

### 3. 修正背景生成方法
- 确保背景生成方法的参数格式正确
- 修正模型名称和配置参数

## 具体修改步骤

1. 修改导入语句，移除`Type`导入
2. 修正`polishTextWithGemini`函数中的`generateContent`调用
3. 修正`generateBackgroundWithGemini`函数中的`generateContent`调用
4. 确保所有参数格式符合Google GenAI库的要求

## 预期结果
修复后，geminiService.ts文件将不再报错，AI功能（文本润色和背景生成）将能够正常工作。