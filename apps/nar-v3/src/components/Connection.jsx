/*
The Connection component is purely graphical.
It draws a large, downward pointing arrow using the following CSS
(in public/index.css):

.triangle-down {
    width: 400px;
    height: 0;
    border-left: 200px solid transparent;
    border-right: 200px solid transparent;
    border-top: 40px solid lightgray;
}

Copyright 2024 Andrew P. Davison, CNRS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import Stack from "@mui/material/Stack";

function Connection() {
  return (
    <Stack direction="row" justifyContent="center">
      <div className="triangle-down" />
    </Stack>
  );
}

export default Connection;
