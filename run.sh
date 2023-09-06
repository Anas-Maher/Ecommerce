#!/bin/bash
echo -e "\nEnter The FileName"
read file
cd './src/controllers' || exit
touch $file'-controller.js' || exit
cd "../db/models" || exit
touch $file'-model.js' || exit
cd "../../routes" || exit
touch $file'-router.js' || exit
cd "../validation" || exit
touch $file'-schema.js' || exit
cd "../../" || exit
exit
