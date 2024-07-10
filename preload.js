/** @format */

window.exports = {
	getFile: {
		mode: "list",
		args: {
			placeholder: "请输入文件夹别名",
			search: (action, searchWord, callbackSetList) => {
				callbackSetList([
					{
						title: "确认",
						description: "文件夹“" + action.payload[0].name + "”设置别名为：“" + searchWord + "”",
						value: searchWord,
					},
				]);
			},
			select: (action, itemData, callbackSetList) => {
				let rootPath = action.payload[0].path;
				let alias = itemData.value;
				let fineName = "desktop.ini";
				let pata = rootPath + "/" + fineName;
				let fileContent =
					`[.ShellClassInfo]
LocalizedResourceName=` +
					alias +
					`
IconResource=C:\\WINDOWS\\System32\\SHELL32.dll,3
[ViewState]
Mode=
Vid=
FolderType=Generic`;

				if (alias.length >= 1) {
					// console.log("别名格式正确，尝试命名");
					const fs = require("fs");
					const iconv = require("iconv-lite");
					fs.readFile(pata, function (err, data) {
						if (err) {
							// console.log("新建GBK文件");
							const gbkBuffer = iconv.encode(fileContent, "GBK");
							fs.writeFile(pata, gbkBuffer, function (err) {
								if (err) {
									// console.log("文件创建失败，寄", err);
									console.error(err);
								}
								// console.log("文件创建成功，退出");
								window.utools.outPlugin();
							});
						} else {
							// console.log("读取GBK文件");
							let content = iconv.decode(data, "GBK");
							let hasSCI = content.indexOf("[.ShellClassInfo]");
							if (hasSCI != -1) {
								// console.log("之前有自定义设置");
								let hasLRN = content.indexOf("LocalizedResourceName=");
								if (hasLRN != -1) {
									// console.log("之前有别名");
									let arrLRN = content.split("LocalizedResourceName=");
									let arrEN = arrLRN[1].split(`
`);
									if (arrEN[0] == "") {
										// console.log("之前的别名是空的");
										let addContent =
											`
LocalizedResourceName=` +
											alias +
											`
`;
										content = arrLRN[0] + addContent + arrLRN[1];
									} else {
										// console.log("之前真的有别名");
										let addContent =
											`
LocalizedResourceName=` +
											alias +
											`
`;
										let arrTN = content.split(arrEN[0]);
										content = arrLRN[0] + addContent + arrTN[1];
									}
								} else {
									// console.log("之前没有别名");
									let arrSCI = message.split("[.ShellClassInfo]");
									let addContent =
										`
LocalizedResourceName=` +
										alias +
										`
`;
									content = arrSCI[0] + addContent + arrSCI[1];
								}
							} else {
								// console.log("之前没有自定义设置");
								let addContent =
									`[.ShellClassInfo]
LocalizedResourceName=` +
									alias +
									`
`;
								content = addContent + content;
							}
							fs.writeFileSync(pata, iconv.encode(content, "GBK"));
							// console.log("修改成功，退出");
							window.utools.outPlugin();
						}
					});
				}
			},
		},
	},
};
