import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface ProductInfoProps {
  description: string;
  material: string;
  care: string[];
}

export function ProductInfo({ description, material, care }: ProductInfoProps) {
  return (
    <Accordion.Root type="multiple" className="border-t border-neutral-200">
      <Accordion.Item value="description">
        <Accordion.Trigger className="flex w-full items-center justify-between py-4 border-b border-neutral-200 hover:bg-neutral-50 px-4 transition-colors group">
          <span className="text-sm uppercase tracking-wider">Product Details</span>
          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
        <Accordion.Content className="px-4 py-4 text-sm text-neutral-700 border-b border-neutral-200 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
          {description}
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="material">
        <Accordion.Trigger className="flex w-full items-center justify-between py-4 border-b border-neutral-200 hover:bg-neutral-50 px-4 transition-colors group">
          <span className="text-sm uppercase tracking-wider">Material & Care</span>
          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
        <Accordion.Content className="px-4 py-4 text-sm text-neutral-700 border-b border-neutral-200 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
          <div className="space-y-3">
            <div>
              <p className="uppercase text-xs tracking-wider mb-1 text-neutral-500">
                Material
              </p>
              <p>{material}</p>
            </div>
            <div>
              <p className="uppercase text-xs tracking-wider mb-1 text-neutral-500">
                Care Instructions
              </p>
              <ul className="space-y-1">
                {care.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="size-1 bg-black rounded-full mt-2" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="return">
        <Accordion.Trigger className="flex w-full items-center justify-between py-4 border-b border-neutral-200 hover:bg-neutral-50 px-4 transition-colors group">
          <span className="text-sm uppercase tracking-wider">Return & Exchange</span>
          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
        <Accordion.Content className="px-4 py-4 text-sm text-neutral-700 border-b border-neutral-200 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="size-1 bg-black rounded-full mt-2" />
              <span>Easy 7 days return & exchange available</span>
            </li>
            {/* <li className="flex items-start gap-2">
              <span className="size-1 bg-black rounded-full mt-2" />
              <span</span>
            </li> */}
            <li className="flex items-start gap-2">
              <span className="size-1 bg-black rounded-full mt-2" />
              <span>Items must be unused with original tags</span>
            </li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
