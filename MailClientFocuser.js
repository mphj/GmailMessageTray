/*
 * Copyright (c) 2017 Gmail Message Tray contributors
 *
 * Gmail Message Tray Extension is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * Gmail Message Tray Extension is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Gnome Documents; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * Authors:
 * Shuming Chan <shuming0207@gmail.com>
 *
 */
"use strict";
const Lang = imports.lang;
const screen = global.screen;
const Meta = imports.gi.Meta;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;

const MailClientFocuser = new Lang.Class({
    Name: 'MailClientFocuser',
    _init: function () {
    },
    open: function () {
        const defaultMailClient = Gio.app_info_get_default_for_uri_scheme("mailto").get_executable();
        if(!this._trySwitchToExistingMailClient(defaultMailClient)){
            this._openNewMailClient(defaultMailClient);
        }
    },
    _openNewMailClient: function (mailClient) {
        Util.trySpawnCommandLine(mailClient);
    },
    _trySwitchToExistingMailClient: function (mailClient) {
        for (let i = 0; i < screen.n_workspaces; i++) {
            const workspace = screen.get_workspace_by_index(i);
            if (this._trySwitchToProgram(workspace, mailClient)) {
                return true;
            }
        }
        return false;
    },
    _trySwitchToProgram: function(workspace, program){
        const display = screen.get_display();
        const windows = display.get_tab_list(Meta.TabList.NORMAL, workspace);
        for (let i = 0; i < windows.length; i++) {
            const class_instance = windows[i].get_wm_class_instance();
            if (class_instance === program) {
                Main.activateWindow(windows[i]);
                return true;
            }
        }
        return false;
    }
});
