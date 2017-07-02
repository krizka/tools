/**
 * Created by kriz on 28/04/16.
 */

export function renderEmailTemplate(templateName, data) {
		const html = SSR.render(templateName, data);
		return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
${html}
</html>`;
}
