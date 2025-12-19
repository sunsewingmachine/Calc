#!/usr/bin/env python3
import re

file_path = 'docs/specs_v1/02_roles_and_permissions.md'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update Permission Matrix - match the exact content
pattern1 = r'(\| Action \| Employee \| Admin \| Owner \|\n\|------\|----------\|-------\|-------\|\nCreate party \| Yes \| Yes \| Yes \|\nEdit party \| Same day \| Same day \| Yes \|\nCreate item \| Yes \| Yes \| Yes \|\nEdit item \| Same day \| Same day \| Yes \|\nCreate purchase/sales \| Yes \| Yes \| Yes \|\nEdit purchase/sales \| Same day \| Same day \| No \|\nAudit entries \| No \| Yes \| Yes \|\nCreate adjustments \| No \| Yes \| Yes \|\nView reports \| Own branch \| All \| All \|\nManage branches \| No \| No \| Yes \|\nDelete data \| No \| No \| No \|)'

replacement1 = '''| Action | Viewer | Employee | Admin | Owner |
|------|--------|----------|-------|-------|
|View parties | Yes | Yes | Yes | Yes |
|Create party | No | Yes | Yes | Yes |
|Edit party | No | Same day | Same day | Yes |
|View items | Yes | Yes | Yes | Yes |
|Create item | No | Yes | Yes | Yes |
|Edit item | No | Same day | Same day | Yes |
|View transactions | Yes | Yes | Yes | Yes |
|Create purchase/sales | No | Yes | Yes | Yes |
|Edit purchase/sales | No | Same day | Same day | No |
|View expenses | Yes | Yes | Yes | Yes |
|Create expenses | No | Yes | Yes | Yes |
|Audit entries | No | No | Yes | Yes |
|Create adjustments | No | No | Yes | Yes |
|View reports | Own branch | Own branch | All | All |
|Manage branches | No | No | No | Yes |
|Delete data | No | No | No | No |'''

content = re.sub(pattern1, replacement1, content)

# Update Cash Drawer Permissions
pattern2 = r'(\| Action \| Employee \| Admin \| Owner \|\n\|------\|----------\|-------\|-------\|\nEnter opening cash \| Yes \| Yes \| Yes \|\nEnter closing cash \| Yes \| Yes \| Yes \|\nAudit cash day \| No \| Yes \| Yes \|\nAdjust difference \| No \| No \| Yes \|)'

replacement2 = '''| Action | Viewer | Employee | Admin | Owner |
|------|--------|----------|-------|-------|
|View cash drawer | Yes | Yes | Yes | Yes |
|Enter opening cash | No | Yes | Yes | Yes |
|Enter closing cash | No | Yes | Yes | Yes |
|Audit cash day | No | No | Yes | Yes |
|Adjust difference | No | No | No | Yes |'''

content = re.sub(pattern2, replacement2, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Tables updated!")
