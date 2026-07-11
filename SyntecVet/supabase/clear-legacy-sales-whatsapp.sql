-- Execute uma vez no SQL Editor para remover o numero antigo do representante.
-- O novo administrador devera preencher nome e WhatsApp pelo painel do sistema.

alter table public.sales_settings
  alter column whatsapp_number set default '';

update public.sales_settings
set
  whatsapp_number = '',
  updated_at = now()
where whatsapp_number = '5571999216734';

select id, representative_name, whatsapp_number, updated_at
from public.sales_settings;
