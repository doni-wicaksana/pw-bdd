import { Page } from '@playwright/test';

export default class BingPage {
    private page: Page;
    public get inputSearch() {
        return this.page.getByPlaceholder('Search the web');
    }
    public get linkDoniWicaksanaAtFirstResult() {
        return this.page.getByRole('link', { name: 'Doni Wicaksana - QA Manager - Alodokter | LinkedIn' }).first();
    }
    constructor(page: Page) {
        this.page = page;
    }
}
