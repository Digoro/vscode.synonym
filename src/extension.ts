import fetch from 'node-fetch';
import * as vscode from 'vscode';
import { window } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const API_URL = 'https://api.datamuse.com/words?ml=';

	vscode.commands.registerCommand("synonym.find", async () => {
		const editor = window.activeTextEditor;
		const text = editor?.document.getText(editor.selection);
		fetch(`${API_URL}${text}`).then(async (resp) => {
			const words = await resp.json();
			if (!words) {
				window.showWarningMessage("No synonyms found. Please check if the word entered is correct.");
				return;
			} else {
				if (words.length === 0) {
					window.showWarningMessage("No synonyms found. Please check if the word entered is correct.");
					return;
				}
			}
			const quickPick = window.createQuickPick();
			quickPick.items = words.map((word: any) => ({ label: word.word }));
			quickPick.onDidChangeSelection(([item]) => {
				if (item) {
					editor?.edit(edit => edit.replace(editor.selection, item.label));
					quickPick.dispose();
				}
			});
			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		}).catch(error => {
			window.showWarningMessage("No synonyms found. Please check if the word entered is correct.");
		});
	});
}

export function deactivate() { }
